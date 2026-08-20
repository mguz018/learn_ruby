# frozen_string_literal: true

require 'date'

module LifeOS
  # Everything the dashboard shows that isn't stored directly: streaks, money
  # roll-ups, task pressure. Kept as pure functions over a state hash so it can
  # be tested without a server or a file on disk.
  module Insights
    module_function

    def summary(state, today: Date.today)
      {
        'today' => today.to_s,
        'tasks' => task_summary(state, today),
        'money' => money_summary(state, today),
        'habits' => state['habits'].map { |h| habit_summary(h, today) },
        'goals' => state['goals'].map { |g| goal_summary(g) },
        'areas' => area_summary(state, today)
      }
    end

    # --- tasks ---------------------------------------------------------------

    def task_summary(state, today)
      tasks = state['tasks']
      open_tasks = tasks.reject { |t| t['status'] == 'done' }

      {
        'total' => tasks.length,
        'open' => open_tasks.length,
        'doing' => tasks.count { |t| t['status'] == 'doing' },
        'done' => tasks.count { |t| t['status'] == 'done' },
        'due_today' => open_tasks.count { |t| t['due'] == today.to_s },
        'overdue' => open_tasks.count { |t| overdue?(t, today) },
        'completed_this_week' => tasks.count { |t| completed_within?(t, today, 7) }
      }
    end

    def overdue?(task, today)
      due = parse_date(task['due'])
      !due.nil? && due < today
    end

    def completed_within?(task, today, days)
      return false unless task['status'] == 'done'

      stamp = task['completed_at'] || task['updated_at']
      date = parse_date(stamp)
      !date.nil? && date > (today - days) && date <= today
    end

    # --- money ---------------------------------------------------------------

    def money_summary(state, today)
      entries = state['money']
      month_start = Date.new(today.year, today.month, 1)

      {
        'all_time' => totals(entries),
        'this_month' => totals(entries.select { |e| on_or_after?(e, month_start) }),
        'last_30_days' => totals(entries.select { |e| on_or_after?(e, today - 30) }),
        'by_area' => entries.group_by { |e| e['area_id'] }.transform_values { |list| totals(list) }
      }
    end

    def totals(entries)
      income  = entries.select { |e| e['kind'] == 'income'  }.sum { |e| e['amount'].to_f }
      expense = entries.select { |e| e['kind'] == 'expense' }.sum { |e| e['amount'].to_f }
      { 'income' => round2(income), 'expense' => round2(expense), 'net' => round2(income - expense) }
    end

    def on_or_after?(entry, boundary)
      date = parse_date(entry['date'])
      !date.nil? && date >= boundary
    end

    # --- habits --------------------------------------------------------------

    def habit_summary(habit, today)
      done = (habit['log'] || []).filter_map { |d| parse_date(d) }.uniq.sort
      {
        'id' => habit['id'],
        'name' => habit['name'],
        'area_id' => habit['area_id'],
        'target' => habit['target'],
        'done_today' => done.include?(today),
        'streak' => current_streak(done, today),
        'best_streak' => best_streak(done),
        'last_7' => (0..6).map { |i| done.include?(today - i) }.reverse,
        'this_week' => (0..6).count { |i| done.include?(today - i) }
      }
    end

    # Counts back from today. Not having done it *yet* today doesn't break the
    # streak — the day isn't over — so we start from yesterday in that case.
    def current_streak(done, today)
      cursor = done.include?(today) ? today : today - 1
      streak = 0
      while done.include?(cursor)
        streak += 1
        cursor -= 1
      end
      streak
    end

    def best_streak(done)
      best = 0
      run = 0
      previous = nil
      done.each do |date|
        run = (previous && date == previous + 1) ? run + 1 : 1
        best = run if run > best
        previous = date
      end
      best
    end

    # --- goals & areas -------------------------------------------------------

    def goal_summary(goal)
      target = goal['target'].to_f
      current = goal['current'].to_f
      percent = target.zero? ? 0 : ((current / target) * 100).round
      goal.merge('percent' => [percent, 999].min, 'complete' => current >= target && target.positive?)
    end

    def area_summary(state, today)
      state['areas'].map do |area|
        tasks = state['tasks'].select { |t| t['area_id'] == area['id'] }
        entries = state['money'].select { |m| m['area_id'] == area['id'] }
        area.merge(
          'open_tasks' => tasks.count { |t| t['status'] != 'done' },
          'overdue_tasks' => tasks.count { |t| t['status'] != 'done' && overdue?(t, today) },
          'net' => totals(entries)['net']
        )
      end
    end

    def parse_date(value)
      return nil if value.nil? || value.to_s.empty?

      Date.parse(value.to_s)
    rescue ArgumentError, TypeError
      nil
    end

    def round2(number)
      (number * 100).round / 100.0
    end
  end
end
