require 'httparty'
require_relative './filters.rb'
require_relative './statistics_endpoints.rb'
require_relative './api_endpoints.rb'

class RequestError < StandardError; end;

class StatsRequest
  include Filters
  include StatisticsEndpoints
  include ApiEndpoints

  def initialize(options)
    @options = options
  end

  def debug
    requests.keys.map { |key| [key, send(key)] }.to_h
  end

  private

  def default(value)
    @options.enable_defaults ? value : {}
  end

  def chat?
    @options.engagement_type == :chat
  end

  def voice?
    @options.engagement_type == :voice
  end
end
