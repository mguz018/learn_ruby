# frozen_string_literal: true

require 'socket'
require 'uri'
require 'json'

module LifeOS
  Request = Struct.new(:method, :path, :query, :headers, :body, keyword_init: true) do
    def json
      return {} if body.nil? || body.empty?

      JSON.parse(body)
    rescue JSON::ParserError
      {}
    end
  end

  # A deliberately small HTTP/1.1 server built on TCPSocket.
  #
  # Ruby 3.3 dropped webrick from the default gems, and the whole point of this
  # project is that it runs with nothing but `ruby`. Everything here is the
  # minimum needed to serve a local single-user dashboard: one thread per
  # connection, Content-Length bodies, and `Connection: close` so we never have
  # to implement keep-alive or chunked encoding.
  class HTTPServer
    MAX_BODY = 2 * 1024 * 1024 # 2MB is far more than any note needs.

    STATUS_TEXT = {
      200 => 'OK', 201 => 'Created', 204 => 'No Content',
      400 => 'Bad Request', 404 => 'Not Found', 405 => 'Method Not Allowed',
      413 => 'Payload Too Large', 500 => 'Internal Server Error'
    }.freeze

    def initialize(host:, port:, &handler)
      @host = host
      @port = port
      @handler = handler
    end

    def start
      server = TCPServer.new(@host, @port)
      yield @port if block_given?
      loop do
        client = server.accept
        Thread.new(client) { |socket| serve(socket) }
      end
    rescue Interrupt
      puts "\nLife OS stopped."
    ensure
      server&.close
    end

    private

    def serve(socket)
      request = parse(socket)
      return respond(socket, 400, 'text/plain', 'Bad Request') unless request

      status, content_type, body, extra = @handler.call(request)
      respond(socket, status, content_type, body, extra || {})
    rescue Errno::EPIPE, Errno::ECONNRESET
      # The browser went away mid-response; nothing useful to do.
    rescue StandardError => e
      warn "[life_os] #{e.class}: #{e.message}"
      warn e.backtrace.first(5).join("\n")
      respond(socket, 500, 'application/json', JSON.generate(error: e.message)) rescue nil
    ensure
      socket.close rescue nil
    end

    def parse(socket)
      request_line = socket.gets
      return nil if request_line.nil?

      method, target, _version = request_line.split(' ', 3)
      return nil if method.nil? || target.nil?

      headers = {}
      while (line = socket.gets)
        line = line.chomp
        break if line.empty?

        key, value = line.split(':', 2)
        headers[key.downcase.strip] = value.to_s.strip if key && value
      end

      length = headers['content-length'].to_i
      return nil if length > MAX_BODY

      body = length.positive? ? socket.read(length) : nil

      path, raw_query = target.split('?', 2)
      Request.new(
        method: method.upcase,
        path: URI.decode_www_form_component(path),
        query: parse_query(raw_query),
        headers: headers,
        body: body
      )
    end

    def parse_query(raw)
      return {} if raw.nil? || raw.empty?

      URI.decode_www_form(raw).to_h
    rescue ArgumentError
      {}
    end

    def respond(socket, status, content_type, body, extra = {})
      body = body.to_s
      headers = {
        'Content-Type' => content_type,
        'Content-Length' => body.bytesize.to_s,
        'Connection' => 'close',
        # This server is bound to loopback and holds personal data; make sure
        # nothing it serves gets cached or embedded elsewhere.
        'Cache-Control' => 'no-store',
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options' => 'DENY'
      }.merge(extra)

      socket.write("HTTP/1.1 #{status} #{STATUS_TEXT.fetch(status, 'OK')}\r\n")
      headers.each { |k, v| socket.write("#{k}: #{v}\r\n") }
      socket.write("\r\n")
      socket.write(body) unless status == 204
    end
  end
end
