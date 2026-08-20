#!/usr/bin/env ruby
# frozen_string_literal: true

# Life OS — a personal dashboard for work, side hustles and everything else.
#
#   ruby life_os/server.rb            # http://localhost:4567
#   ruby life_os/server.rb --port 8080
#
# No gems, no build step, no database server. Your data lives in
# life_os/data/life_os.json and never leaves this machine.

require_relative 'lib/http'
require_relative 'lib/app'
require_relative 'lib/store'

module LifeOS
  DEFAULT_PORT = 4567
  # Loopback only. This is your life; it is not for the local coffee shop wifi.
  HOST = '127.0.0.1'

  def self.parse_options(argv)
    options = { port: Integer(ENV.fetch('LIFE_OS_PORT', DEFAULT_PORT)), open: true }
    argv.each_with_index do |arg, i|
      case arg
      when '--port', '-p' then options[:port] = Integer(argv[i + 1])
      when '--no-open'    then options[:open] = false
      when '--help', '-h'
        puts File.read(__FILE__).lines[2..12].map { |l| l.sub(/^# ?/, '') }.join
        exit 0
      end
    end
    options
  end

  def self.run(argv)
    $stdout.sync = true
    options = parse_options(argv)
    root = __dir__
    store = Store.new(File.join(root, 'data', 'life_os.json'))
    app = App.new(store: store, public_dir: File.join(root, 'public'))

    url = "http://localhost:#{options[:port]}"
    server = HTTPServer.new(host: HOST, port: options[:port]) { |request| app.call(request) }

    open_browser(url) if options[:open]
    server.start { announce(url, store.path) }
  rescue Errno::EADDRINUSE
    abort "Port #{options[:port]} is already in use. Try: ruby #{$PROGRAM_NAME} --port #{options[:port] + 1}"
  end

  def self.announce(url, data_path)
    puts <<~BANNER

      ╭──────────────────────────────────────────────╮
      │  Life OS is running                          │
      ╰──────────────────────────────────────────────╯

        Open      #{url}
        Data      #{data_path}
        Stop      Ctrl-C

    BANNER
  end

  # Best effort — if none of these exist we just print the URL and move on.
  def self.open_browser(url)
    opener = ['open', 'xdg-open', 'wslview'].find { |cmd| system('which', cmd, out: File::NULL, err: File::NULL) }
    return unless opener

    Thread.new do
      sleep 0.4
      system(opener, url, out: File::NULL, err: File::NULL)
    end
  end
end

LifeOS.run(ARGV) if $PROGRAM_NAME == __FILE__
