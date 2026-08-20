# frozen_string_literal: true

require 'date'
require 'securerandom'

module LifeOS
  # The starter dataset written on first boot. It exists so the dashboard has
  # something to render before you've typed anything, and so every widget has a
  # worked example. Delete data/life_os.json to get it back.
  module Seed
    module_function

    def build
      today = Date.today
      day = ->(offset) { (today + offset).to_s }

      work      = area('Day Job',        'work',     '#5b8def')
      consult   = area('Consulting',     'hustle',   '#f0a03c')
      shop      = area('Online Store',   'hustle',   '#48bb87')
      health    = area('Health',         'personal', '#e2668a')
      home      = area('Home & Family',  'personal', '#9b7fe0')

      {
        'settings' => {
          'owner' => 'You',
          'currency' => '$',
          'week_starts_on' => 'monday'
        },
        'areas' => [work, consult, shop, health, home],
        'tasks' => [
          task('Ship the Q3 status deck', work['id'],    'doing', 'high',   day.call(0)),
          task('1:1 prep notes',          work['id'],    'todo',  'medium', day.call(1)),
          task('Review PR backlog',       work['id'],    'todo',  'low',    day.call(3)),
          task('Send invoice #014',       consult['id'], 'todo',  'high',   day.call(0)),
          task('Scope the retainer call', consult['id'], 'doing', 'medium', day.call(2)),
          task('Restock best seller',     shop['id'],    'todo',  'high',   day.call(1)),
          task('Photograph new listings', shop['id'],    'todo',  'medium', day.call(5)),
          task('Book the dentist',        health['id'],  'todo',  'medium', day.call(4)),
          task('Meal prep for the week',  health['id'],  'done',  'low',    day.call(-1)),
          task('Fix the garage light',    home['id'],    'todo',  'low',    day.call(9))
        ],
        'habits' => [
          habit('Move for 30 minutes', health['id'], 'daily',  7, recent_log(today, [0, 1, 2, 4, 5])),
          habit('Read before bed',     health['id'], 'daily',  7, recent_log(today, [1, 2, 3])),
          habit('Deep work block',     work['id'],   'daily',  5, recent_log(today, [0, 1, 3, 4])),
          habit('Ship one hustle task', consult['id'], 'daily', 5, recent_log(today, [0, 2]))
        ],
        'money' => [
          money(consult['id'], 'income',  2400,   'Retainer — August',     day.call(-6)),
          money(consult['id'], 'income',  650,    'Landing page build',    day.call(-14)),
          money(consult['id'], 'expense', 29,     'Design tool',           day.call(-10)),
          money(shop['id'],    'income',  318.40, 'Store payout',          day.call(-3)),
          money(shop['id'],    'income',  204.10, 'Store payout',          day.call(-17)),
          money(shop['id'],    'expense', 96.25,  'Inventory restock',     day.call(-8)),
          money(shop['id'],    'expense', 18,     'Shipping supplies',     day.call(-2))
        ],
        'events' => [
          event('Team standup',        work['id'],    "#{day.call(0)}T09:30"),
          event('Client discovery call', consult['id'], "#{day.call(1)}T15:00"),
          event('Gym — leg day',       health['id'],  "#{day.call(1)}T18:30"),
          event('Dinner with family',  home['id'],    "#{day.call(2)}T19:00"),
          event('Quarterly review',    work['id'],    "#{day.call(6)}T11:00")
        ],
        'goals' => [
          goal('Side income this month', consult['id'], 3000, 3054.50, '$'),
          goal('Store revenue this month', shop['id'],  1000, 522.50,  '$'),
          goal('Workouts this month',    health['id'],  16,   9,       '')
        ],
        'notes' => [
          note('How I want this quarter to feel',
               "Fewer, bigger things.\n\nWork: one visible win per month.\nHustle: get the retainer to cover rent.\nPersonal: protect evenings — no laptop after 8pm.",
               nil, true),
          note('Consulting pipeline',
               "- Acme: sent proposal, follow up Friday\n- Bright Labs: warm intro from Dana\n- Referral from old manager, no timeline yet",
               consult['id'], false)
        ]
      }
    end

    def area(name, kind, color)
      { 'id' => SecureRandom.hex(6), 'name' => name, 'kind' => kind, 'color' => color, 'created_at' => stamp }
    end

    def task(title, area_id, status, priority, due)
      {
        'id' => SecureRandom.hex(6), 'title' => title, 'area_id' => area_id,
        'status' => status, 'priority' => priority, 'due' => due, 'notes' => '',
        'created_at' => stamp,
        'completed_at' => (status == 'done' ? stamp : nil)
      }
    end

    def habit(name, area_id, cadence, target, log)
      {
        'id' => SecureRandom.hex(6), 'name' => name, 'area_id' => area_id,
        'cadence' => cadence, 'target' => target, 'log' => log, 'created_at' => stamp
      }
    end

    def money(area_id, kind, amount, label, date)
      {
        'id' => SecureRandom.hex(6), 'area_id' => area_id, 'kind' => kind,
        'amount' => amount, 'label' => label, 'date' => date, 'created_at' => stamp
      }
    end

    def event(title, area_id, starts_at)
      { 'id' => SecureRandom.hex(6), 'title' => title, 'area_id' => area_id, 'starts_at' => starts_at, 'created_at' => stamp }
    end

    def goal(title, area_id, target, current, unit)
      {
        'id' => SecureRandom.hex(6), 'title' => title, 'area_id' => area_id,
        'target' => target, 'current' => current, 'unit' => unit, 'created_at' => stamp
      }
    end

    def note(title, body, area_id, pinned)
      {
        'id' => SecureRandom.hex(6), 'title' => title, 'body' => body,
        'area_id' => area_id, 'pinned' => pinned, 'created_at' => stamp, 'updated_at' => stamp
      }
    end

    # Days back from today that a habit was completed, e.g. [0, 1, 3].
    def recent_log(today, offsets)
      offsets.map { |o| (today - o).to_s }
    end

    def stamp
      Time.now.utc.iso8601
    end
  end
end
