require_relative './stats_request.rb'

class AgentQueueData < StatsRequest
  DURATIONS_DEFAULT = {
    answ_call_cnt: 0,
    talking_call_dur: 0,
    transfer_out_call_cnt: 0
  }.freeze
  POST_DURATIONS_DEFAULT = {
    wrap_up_dur: 0
  }.freeze
  OPERATORS_DEFAULT = {
    agent_name: 'Unknown Agent'
  }.freeze
  QUEUES_DEFAULT = {
    queue_name: 'Unknown Queue'
  }.freeze

  def requests
    {
      durations: {
        fields: [site_id_filter, operator_id_filter, queue_id_filter, queue_id_present_filter],
        dimensions: %w[site_id operator_id queue_id end_reason]
      },
      post_durations: {
        fields: [site_id_filter, operator_id_filter, queue_id_filter, user_type_filter, queue_id_present_filter],
        dimensions: %w[site_id operator_id queue_id]
      },
      operators: {},
      queues: {}
    }
  end

  def call
    durations = durations_data_map
    post_durations = post_durations_data_map

    identifiers = durations.keys.concat(post_durations.keys)
    site_ids = durations.values.map { |d| d[:site_id] }.concat(
      post_durations.values.map { |d| d[:site_id] }
    ).uniq

    operators = operators_data_map(site_ids)
    queues = queues_data_map(site_ids)

    result = {}
    identifiers.each do |identifier|
      operator_id, queue_id = identifier.split('|')

      result[identifier] = {
        agent_id: operator_id,
        queue: queue_id
      }.merge(
        durations[identifier] || default(DURATIONS_DEFAULT)
      ).merge(
        post_durations[identifier] || default(POST_DURATIONS_DEFAULT)
      ).merge(
        operators[operator_id] || default(OPERATORS_DEFAULT)
      ).merge(
        queues[queue_id] || default(QUEUES_DEFAULT)
      )
    end

    result
  end

  private

  def operators_data_map(site_ids)
    new_data = {}

    operators(site_ids).each do |obj|
      new_data[obj['id']] = {
        agent_name: obj['name']
      }
    end

    new_data
  end

  def queues_data_map(site_ids)
    new_data = {}

    queues(site_ids).each do |obj|
      new_data[obj['id']] = {
        queue_name: obj['name']
      }
    end

    new_data
  end

  def durations_data_map
    new_data = {}
    durations.group_by { |d| "#{d['operator_id']}|#{d['queue_id']}" }.each do |identifier, engagements|
      new_data[identifier] = {
        site_id: engagements.first['site_id'],
        answ_call_cnt: engagements.sum { |d| d['count'] },
        talking_call_dur: engagements.sum { |d| d['total_duration_in_seconds'] },
        transfer_out_call_cnt: engagements.select { |d| d['end_reason'] == 'transfer' }.sum { |d| d['count'] }
      }
    end
    new_data
  end

  def post_durations_data_map
    new_data = {}
    post_durations.group_by { |d| "#{d['operator_id']}|#{d['queue_id']}" }.each do |identifier, engagements|
      new_data[identifier] = {
        site_id: engagements.first['site_id'],
        wrap_up_dur: engagements.sum { |d| d['total_duration_in_seconds'] }
      }
    end
    new_data
  end
end
