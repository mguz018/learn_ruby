# frozen_string_literal: true

# Run with: ruby life_os/test/test_life_os.rb
# Uses minitest from the standard library — no bundle install needed.

require 'minitest/autorun'
require 'tmpdir'
require 'date'
require_relative '../lib/store'
require_relative '../lib/insights'
require_relative '../lib/app'
require_relative '../lib/http'

module TestHelpers
  def with_store
    Dir.mktmpdir do |dir|
      yield LifeOS::Store.new(File.join(dir, 'life_os.json'))
    end
  end

  def request(method, path, body = nil, query = {})
    LifeOS::Request.new(
      method: method, path: path, query: query, headers: {},
      body: body && JSON.generate(body)
    )
  end
end

class StoreTest < Minitest::Test
  include TestHelpers

  def test_seeds_a_usable_file_on_first_boot
    with_store do |store|
      assert File.exist?(store.path), 'expected the data file to be written'
      refute_empty store.collection('areas')
      refute_empty store.collection('tasks')
    end
  end

  def test_create_assigns_id_and_timestamp
    with_store do |store|
      record = store.create('tasks', 'title' => 'Buy milk')
      assert_match(/\A[0-9a-f]{12}\z/, record['id'])
      refute_nil record['created_at']
      assert_includes store.collection('tasks').map { |t| t['title'] }, 'Buy milk'
    end
  end

  def test_update_and_delete
    with_store do |store|
      record = store.create('notes', 'title' => 'Draft')
      store.update('notes', record['id'], 'title' => 'Final')
      assert_equal 'Final', store.find('notes', record['id'])['title']

      store.delete('notes', record['id'])
      assert_nil store.find('notes', record['id'])
    end
  end

  def test_update_cannot_overwrite_the_id
    with_store do |store|
      record = store.create('tasks', 'title' => 'Keep id')
      store.update('tasks', record['id'], 'id' => 'hacked', 'title' => 'Renamed')
      assert_equal 'Renamed', store.find('tasks', record['id'])['title']
      assert_nil store.find('tasks', 'hacked')
    end
  end

  def test_data_survives_a_restart
    Dir.mktmpdir do |dir|
      path = File.join(dir, 'life_os.json')
      id = LifeOS::Store.new(path).create('tasks', 'title' => 'Persisted')['id']
      assert_equal 'Persisted', LifeOS::Store.new(path).find('tasks', id)['title']
    end
  end

  def test_snapshot_is_a_copy
    with_store do |store|
      snapshot = store.snapshot
      snapshot['tasks'] << { 'id' => 'ghost' }
      refute_includes store.collection('tasks').map { |t| t['id'] }, 'ghost'
    end
  end

  def test_missing_collections_are_backfilled_for_old_files
    Dir.mktmpdir do |dir|
      path = File.join(dir, 'life_os.json')
      File.write(path, JSON.generate('tasks' => [{ 'id' => 'a', 'title' => 'Only tasks' }]))
      store = LifeOS::Store.new(path)
      LifeOS::Store::COLLECTIONS.each { |name| assert_equal [], store.collection(name), name unless name == 'tasks' }
    end
  end
end

class InsightsTest < Minitest::Test
  TODAY = Date.new(2026, 8, 20)

  def state(overrides = {})
    base = { 'areas' => [], 'tasks' => [], 'habits' => [], 'money' => [], 'goals' => [], 'events' => [], 'notes' => [] }
    base.merge(overrides)
  end

  def test_counts_overdue_and_due_today_but_never_done_ones
    tasks = [
      { 'status' => 'todo',  'due' => '2026-08-19' },  # overdue
      { 'status' => 'todo',  'due' => '2026-08-20' },  # today
      { 'status' => 'doing', 'due' => '2026-08-25' },
      { 'status' => 'done',  'due' => '2026-08-01' }   # done, so not overdue
    ]
    summary = LifeOS::Insights.task_summary(state('tasks' => tasks), TODAY)
    assert_equal 1, summary['overdue']
    assert_equal 1, summary['due_today']
    assert_equal 3, summary['open']
    assert_equal 1, summary['doing']
  end

  def test_a_task_with_no_due_date_is_never_overdue
    tasks = [{ 'status' => 'todo', 'due' => nil }, { 'status' => 'todo', 'due' => '' }]
    assert_equal 0, LifeOS::Insights.task_summary(state('tasks' => tasks), TODAY)['overdue']
  end

  def test_money_rolls_up_by_window_and_area
    entries = [
      { 'area_id' => 'a', 'kind' => 'income',  'amount' => 100, 'date' => '2026-08-10' },
      { 'area_id' => 'a', 'kind' => 'expense', 'amount' => 30,  'date' => '2026-08-11' },
      { 'area_id' => 'b', 'kind' => 'income',  'amount' => 50,  'date' => '2026-07-01' } # last month
    ]
    summary = LifeOS::Insights.money_summary(state('money' => entries), TODAY)
    assert_equal 150, summary['all_time']['income']
    assert_equal 70,  summary['this_month']['net']
    assert_equal 70,  summary['by_area']['a']['net']
    assert_equal 50,  summary['by_area']['b']['income']
  end

  def test_streak_counts_back_from_today
    habit = { 'id' => 'h', 'name' => 'Read', 'target' => 7, 'log' => %w[2026-08-20 2026-08-19 2026-08-18] }
    summary = LifeOS::Insights.habit_summary(habit, TODAY)
    assert_equal 3, summary['streak']
    assert summary['done_today']
  end

  def test_an_unchecked_today_does_not_break_yesterdays_streak
    habit = { 'id' => 'h', 'name' => 'Read', 'target' => 7, 'log' => %w[2026-08-19 2026-08-18] }
    summary = LifeOS::Insights.habit_summary(habit, TODAY)
    assert_equal 2, summary['streak'], 'the day is not over yet'
    refute summary['done_today']
  end

  def test_a_gap_ends_the_streak_but_best_streak_remembers
    habit = { 'id' => 'h', 'name' => 'Read', 'target' => 7, 'log' => %w[2026-08-20 2026-08-17 2026-08-16 2026-08-15 2026-08-14] }
    summary = LifeOS::Insights.habit_summary(habit, TODAY)
    assert_equal 1, summary['streak']
    assert_equal 4, summary['best_streak']
  end

  def test_last_7_is_oldest_first_and_ends_on_today
    habit = { 'id' => 'h', 'name' => 'Read', 'target' => 7, 'log' => ['2026-08-20'] }
    last7 = LifeOS::Insights.habit_summary(habit, TODAY)['last_7']
    assert_equal 7, last7.length
    assert_equal true, last7.last
    assert_equal [false] * 6, last7[0..5]
  end

  def test_goal_percent_and_completion
    assert_equal 50, LifeOS::Insights.goal_summary('target' => 200, 'current' => 100)['percent']
    assert LifeOS::Insights.goal_summary('target' => 200, 'current' => 200)['complete']
    assert_equal 0, LifeOS::Insights.goal_summary('target' => 0, 'current' => 10)['percent'], 'no divide by zero'
  end

  def test_garbage_dates_do_not_raise
    tasks = [{ 'status' => 'todo', 'due' => 'not a date' }]
    assert_equal 0, LifeOS::Insights.task_summary(state('tasks' => tasks), TODAY)['overdue']
  end
end

class AppTest < Minitest::Test
  include TestHelpers

  def with_app
    with_store do |store|
      yield LifeOS::App.new(store: store, public_dir: File.expand_path('../public', __dir__)), store
    end
  end

  def body_of(response)
    JSON.parse(response[2])
  end

  def test_state_includes_the_computed_summary
    with_app do |app|
      status, _type, body = app.call(request('GET', '/api/state'))
      assert_equal 200, status
      payload = JSON.parse(body)
      assert payload['summary']['tasks']['open'] >= 0
      assert_kind_of Array, payload['summary']['habits']
    end
  end

  def test_full_crud_round_trip
    with_app do |app|
      created = body_of(app.call(request('POST', '/api/tasks', { 'title' => 'Write tests' })))
      assert_equal 'todo', created['status'], 'defaults are applied'

      updated = body_of(app.call(request('PATCH', "/api/tasks/#{created['id']}", { 'title' => 'Write more tests' })))
      assert_equal 'Write more tests', updated['title']

      status, = app.call(request('DELETE', "/api/tasks/#{created['id']}"))
      assert_equal 200, status
      assert_equal 404, app.call(request('PATCH', "/api/tasks/#{created['id']}", { 'title' => 'x' })).first
    end
  end

  def test_unknown_fields_are_dropped
    with_app do |app|
      created = body_of(app.call(request('POST', '/api/tasks', { 'title' => 'Fine', 'is_admin' => true })))
      refute created.key?('is_admin')
    end
  end

  def test_unknown_collections_are_rejected
    with_app do |app|
      assert_equal 404, app.call(request('POST', '/api/passwords', { 'title' => 'nope' })).first
    end
  end

  def test_task_toggle_cycles_and_stamps_completion
    with_app do |app|
      task = body_of(app.call(request('POST', '/api/tasks', { 'title' => 'Cycle me' })))
      assert_equal 'doing', body_of(app.call(request('POST', "/api/tasks/#{task['id']}/toggle")))['status']

      done = body_of(app.call(request('POST', "/api/tasks/#{task['id']}/toggle")))
      assert_equal 'done', done['status']
      refute_nil done['completed_at']

      reopened = body_of(app.call(request('POST', "/api/tasks/#{task['id']}/toggle")))
      assert_equal 'todo', reopened['status']
      assert_nil reopened['completed_at']
    end
  end

  def test_habit_check_is_a_toggle
    with_app do |app|
      habit = body_of(app.call(request('POST', '/api/habits', { 'name' => 'Stretch' })))
      checked = body_of(app.call(request('POST', "/api/habits/#{habit['id']}/check", { 'date' => '2026-08-20' })))
      assert_includes checked['log'], '2026-08-20'

      unchecked = body_of(app.call(request('POST', "/api/habits/#{habit['id']}/check", { 'date' => '2026-08-20' })))
      refute_includes unchecked['log'], '2026-08-20'
    end
  end

  def test_deleting_an_area_unassigns_rather_than_orphans
    with_app do |app|
      area = body_of(app.call(request('POST', '/api/areas', { 'name' => 'Temporary', 'kind' => 'hustle' })))
      task = body_of(app.call(request('POST', '/api/tasks', { 'title' => 'Belongs to area', 'area_id' => area['id'] })))

      app.call(request('DELETE', "/api/areas/#{area['id']}"))

      after = body_of(app.call(request('GET', '/api/tasks'))).find { |t| t['id'] == task['id'] }
      refute_nil after, 'the task itself must survive'
      assert_nil after['area_id']
    end
  end

  def test_serves_the_dashboard_at_root
    with_app do |app|
      status, type, body = app.call(request('GET', '/'))
      assert_equal 200, status
      assert_includes type, 'text/html'
      assert_includes body, 'Life OS'
    end
  end

  def test_refuses_to_serve_files_outside_public
    with_app do |app|
      %w[/../lib/store.rb /../../etc/passwd /..%2Fserver.rb].each do |path|
        assert_equal 404, app.call(request('GET', path)).first, "leaked via #{path}"
      end
    end
  end

  def test_rejects_writes_to_static_paths
    with_app do |app|
      assert_equal 405, app.call(request('POST', '/index.html')).first
    end
  end
end
