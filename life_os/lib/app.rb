# frozen_string_literal: true

require 'json'
require 'date'
require 'time'
require_relative 'store'
require_relative 'insights'

module LifeOS
  # Routes requests to either a static file in public/ or the JSON API.
  class App
    # Only these fields are accepted from the browser. Anything else is dropped,
    # so a typo in the UI can't quietly grow the shape of the data file.
    PERMITTED = {
      'areas'  => %w[name kind color note],
      'tasks'  => %w[title notes area_id status priority due],
      'habits' => %w[name area_id cadence target log],
      'money'  => %w[area_id kind amount label date],
      'events' => %w[title area_id starts_at note],
      'notes'  => %w[title body area_id pinned],
      'goals'  => %w[title area_id target current unit]
    }.freeze

    MIME = {
      '.html' => 'text/html; charset=utf-8',
      '.js'   => 'text/javascript; charset=utf-8',
      '.css'  => 'text/css; charset=utf-8',
      '.json' => 'application/json; charset=utf-8',
      '.svg'  => 'image/svg+xml',
      '.ico'  => 'image/x-icon'
    }.freeze

    def initialize(store:, public_dir:)
      @store = store
      @public_dir = File.realpath(public_dir)
    end

    def call(request)
      if request.path.start_with?('/api')
        api(request)
      else
        static(request)
      end
    end

    private

    # --- API -----------------------------------------------------------------

    def api(request)
      segments = request.path.split('/').reject(&:empty?).drop(1) # drop "api"

      case [request.method, segments]
      in ['GET', ['state']]
        state = @store.snapshot
        json(200, state.merge('summary' => Insights.summary(state)))

      in ['GET', ['export']]
        json(200, @store.snapshot, 'Content-Disposition' => %(attachment; filename="life-os-backup-#{Date.today}.json"))

      in ['PATCH', ['settings']]
        json(200, @store.replace_settings(request.json))

      in ['POST', ['habits', String => id, 'check']]
        toggle_habit(id, request.json['date'])

      in ['POST', ['tasks', String => id, 'toggle']]
        toggle_task(id)

      in ['GET', [String => name]] if PERMITTED.key?(name)
        json(200, @store.collection(name))

      in ['POST', [String => name]] if PERMITTED.key?(name)
        attrs = permit(name, request.json)
        return json(400, { 'error' => 'Nothing to save' }) if attrs.empty?

        json(201, @store.create(name, defaults(name).merge(attrs)))

      in ['PATCH', [String => name, String => id]] if PERMITTED.key?(name)
        record = @store.update(name, id, permit(name, request.json))
        record ? json(200, record) : json(404, { 'error' => 'Not found' })

      in ['DELETE', [String => name, String => id]] if PERMITTED.key?(name)
        removed = @store.delete(name, id)
        cascade(name, id) if removed
        removed ? json(200, removed) : json(404, { 'error' => 'Not found' })

      else
        json(404, { 'error' => "No route for #{request.method} #{request.path}" })
      end
    end

    # Checking a habit off is a toggle so a misclick is one click to undo.
    def toggle_habit(id, date)
      day = (date && !date.empty? ? date : Date.today.to_s)
      habit = @store.find('habits', id)
      return json(404, { 'error' => 'Not found' }) unless habit

      log = habit['log'] || []
      log = log.include?(day) ? log - [day] : (log + [day]).sort
      json(200, @store.update('habits', id, { 'log' => log }))
    end

    # Cycles todo -> doing -> done -> todo, stamping completion time on the way.
    def toggle_task(id)
      task = @store.find('tasks', id)
      return json(404, { 'error' => 'Not found' }) unless task

      next_status = { 'todo' => 'doing', 'doing' => 'done', 'done' => 'todo' }.fetch(task['status'], 'doing')
      attrs = { 'status' => next_status }
      attrs['completed_at'] = next_status == 'done' ? Time.now.utc.iso8601 : nil
      json(200, @store.update('tasks', id, attrs))
    end

    # Deleting an area would otherwise leave orphaned records pointing at an id
    # that no longer exists; unassign them instead of deleting someone's data.
    def cascade(name, id)
      return unless name == 'areas'

      @store.transaction do |data|
        %w[tasks habits money events notes goals].each do |collection|
          data[collection].each { |record| record['area_id'] = nil if record['area_id'] == id }
        end
      end
    end

    def permit(name, attrs)
      allowed = PERMITTED.fetch(name, [])
      attrs.select { |key, _| allowed.include?(key) }
    end

    def defaults(name)
      case name
      when 'tasks'  then { 'status' => 'todo', 'priority' => 'medium', 'notes' => '' }
      when 'habits' then { 'cadence' => 'daily', 'target' => 7, 'log' => [] }
      when 'money'  then { 'kind' => 'income', 'date' => Date.today.to_s }
      when 'notes'  then { 'pinned' => false, 'body' => '' }
      when 'goals'  then { 'current' => 0, 'unit' => '' }
      when 'areas'  then { 'kind' => 'personal', 'color' => '#5b8def' }
      else {}
      end
    end

    def json(status, payload, extra = {})
      [status, 'application/json; charset=utf-8', JSON.generate(payload), extra]
    end

    # --- static files --------------------------------------------------------

    def static(request)
      return [405, 'text/plain', 'Method Not Allowed'] unless request.method == 'GET'

      relative = request.path == '/' ? 'index.html' : request.path.sub(%r{\A/}, '')
      file = safe_path(relative)
      return [404, 'text/plain', 'Not found'] unless file

      [200, MIME.fetch(File.extname(file), 'application/octet-stream'), File.binread(file)]
    end

    # Resolves the request against public/ and refuses anything that escapes it,
    # so `GET /../../etc/passwd` can't read outside the app.
    def safe_path(relative)
      candidate = File.expand_path(File.join(@public_dir, relative))
      return nil unless candidate.start_with?(@public_dir + File::SEPARATOR)
      return nil unless File.file?(candidate)

      candidate
    end
  end
end
