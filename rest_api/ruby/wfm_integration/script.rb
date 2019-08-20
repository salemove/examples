require 'bundler'
Bundler.setup(:default)

require 'optparse'
require 'ostruct'
require 'pry'

require_relative 'lib/stats_request.rb'
require_relative 'lib/agent_data.rb'
require_relative 'lib/queue_data.rb'
require_relative 'lib/agent_queue_data.rb'

class ScriptOptionsParser
  def self.parse(args)
    # Defaults
    options = OpenStruct.new

    options.api = 'https://api.salemove.com'
    options.token = nil

    time = Time.now.utc
    options.start_date = (time - 3600).iso8601
    options.end_date = time.iso8601

    options.script = nil
    options.engagement_type = :all
    options.site_id = nil
    options.queue_id = nil
    options.operator_id = nil

    options.enable_defaults = true
    options.debug = false

    opts = OptionParser.new do |opts|
      opts.banner = 'Usage: ruby script.rb [options]'

      opts.on('--script=SCRIPT', %i[agent agent_queue queue], '# Script to run [agent, agent_queue, queue]') do |value|
        options.script = value
      end

      opts.on('--token=TOKEN', '# Auth token') do |value|
        options.token = value
      end

      opts.on('--start=START', '# Start date UTC (iso8601)') do |value|
        options.start_date = Time.parse(value).utc.iso8601
      end

      opts.on('--end=END', '# End date UTC (iso8601)') do |value|
        options.end_date = Time.parse(value).utc.iso8601
      end

      opts.on('--type=TYPE', %i[chat voice all], '# Engagement type [chat, voice, all] (Default: all)') do |value|
        options.engagement_type = value
      end

      opts.on('--site=SITE_ID', '# Specify site_id(s) (Comma separated)') do |value|
        options.site_id = value.split(',')
      end

      opts.on('--operator=OPERATOR_ID', '# Specify operator_id(s) (Only agent and agent_queue) (Comma separated)') do |value|
        options.operator_id = value.split(',')
      end

      opts.on('--queue=QUEUE_ID', '# Specify queue_id(s) (Only queue and agent_queue) (Comma separated)') do |value|
        options.queue_id = value.split(',')
      end

      opts.on('--disable-defaults', '# Disable defaults (Default: false)') do |_|
        options.enable_defaults = false
      end

      opts.on('--debug', '# Debug script by showing raw results from endpoints') do |_|
        options.debug = true
      end
    end

    opts.parse!(args)
    options
  end
end

begin
  options = ScriptOptionsParser.parse(ARGV)
  pp options

  instance =
    case options.script
    when :agent
      AgentData.new(options)
    when :queue
      QueueData.new(options)
    when :agent_queue
      AgentQueueData.new(options)
    when nil
      raise RuntimeError.new, 'Script must specified, use --help for more information'
    else
      raise RuntimeError.new, 'Unknown script, use --help for more information'
    end

  if options.debug
    pp instance.debug
  else
    pp instance.call.values
  end
rescue RequestError => e
  pp JSON.parse(e.message)
rescue OptionParser::InvalidArgument => e
  pp e.message
end
