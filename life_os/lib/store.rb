# frozen_string_literal: true

require 'json'
require 'fileutils'
require 'securerandom'
require 'time'
require_relative 'seed'

module LifeOS
  # A tiny, dependency-free persistence layer.
  #
  # The whole database is one JSON document held in memory and flushed to disk
  # atomically (write to a tmp file, then rename) after every mutation. That is
  # more than fast enough for a single-user life dashboard and it means the data
  # file stays readable, greppable and easy to back up.
  class Store
    COLLECTIONS = %w[areas tasks habits money events notes goals].freeze

    attr_reader :path

    def initialize(path)
      @path = path
      @mutex = Mutex.new
      @data = load_or_seed
    end

    # Yields the raw data hash under the lock. Every writer goes through here so
    # that a save always follows a mutation.
    def transaction
      @mutex.synchronize do
        result = yield @data
        persist!
        result
      end
    end

    def snapshot
      @mutex.synchronize { deep_copy(@data) }
    end

    def collection(name)
      @mutex.synchronize { deep_copy(@data.fetch(name, [])) }
    end

    def create(name, attrs)
      transaction do |data|
        record = attrs.merge(
          'id' => attrs['id'] || SecureRandom.hex(6),
          'created_at' => attrs['created_at'] || now
        )
        data[name] ||= []
        data[name] << record
        record
      end
    end

    def update(name, id, attrs)
      transaction do |data|
        record = (data[name] || []).find { |r| r['id'] == id }
        next nil unless record

        record.merge!(attrs.reject { |k, _| k == 'id' || k == 'created_at' })
        record['updated_at'] = now
        record
      end
    end

    def delete(name, id)
      transaction do |data|
        list = data[name] || []
        removed = list.find { |r| r['id'] == id }
        list.reject! { |r| r['id'] == id }
        removed
      end
    end

    def find(name, id)
      @mutex.synchronize do
        record = (@data[name] || []).find { |r| r['id'] == id }
        record && deep_copy(record)
      end
    end

    def replace_settings(attrs)
      transaction do |data|
        data['settings'] = (data['settings'] || {}).merge(attrs)
      end
    end

    private

    def now
      Time.now.utc.iso8601
    end

    def persist!
      FileUtils.mkdir_p(File.dirname(@path))
      tmp = "#{@path}.tmp"
      File.write(tmp, JSON.pretty_generate(@data))
      File.rename(tmp, @path)
    end

    def load_or_seed
      if File.exist?(@path)
        parsed = JSON.parse(File.read(@path))
        normalize(parsed)
      else
        data = normalize(Seed.build)
        @data = data
        persist!
        data
      end
    rescue JSON::ParserError => e
      raise "Could not parse #{@path}: #{e.message}. Move it aside to start fresh."
    end

    # Guarantees every collection exists so the rest of the app never has to
    # nil-check, and lets old data files pick up new collections for free.
    def normalize(data)
      data['settings'] ||= {}
      COLLECTIONS.each { |name| data[name] ||= [] }
      data
    end

    def deep_copy(obj)
      Marshal.load(Marshal.dump(obj))
    end
  end
end
