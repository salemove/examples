require_relative './stats_request.rb'

class AgentData < StatsRequest
  DURATIONS_DEFAULT = {
    direct_out_call_cnt: 0,
    direct_in_call_cnt: 0,
    direct_out_call_dur: 0,
    direct_in_call_dur: 0
  }.freeze
  ONLINE_DURATIONS_DEFAULT = {
    tot_work_dur: 0,
    pause_dur: 0,
    avail_dur: 0,
    wait_dur: 0,
    admin_dur: 0
  }.freeze
  OPERATORS_DEFAULT = {
    agent_name: 'Unknown Agent'
  }.freeze

  AVAILABLE_TYPES = %w[video audio chat post-engagement engaged].freeze
  WAIT_TYPES = %w[video audio chat].freeze
  ADMIN_TYPES = %w[advanced-admin reporting].freeze

  def requests
    {
      online_durations: {
        fields: [site_id_filter, operator_id_filter],
        dimensions: %w[site_id operator_id type]
      },
      durations: {
        fields: [site_id_filter, operator_id_filter, queue_id_missing_filter],
        dimensions: %w[site_id operator_id type]
      },
      operators: {}
    }
  end

  def call
    durations = durations_data_map
    online_durations = online_durations_data_map

    result = {}

    operator_ids = durations.keys.concat(online_durations.keys)
    site_ids = durations.values.map { |d| d[:site_id] }.concat(
      online_durations.values.map { |d| d[:site_id] }
    ).uniq

    operators = operators_data_map(site_ids)

    operator_ids.each do |operator_id|
      result[operator_id] = {
        agent_id: operator_id
      }.merge(
        durations[operator_id] || default(DURATIONS_DEFAULT)
      ).merge(
        online_durations[operator_id] || default(ONLINE_DURATIONS_DEFAULT)
      ).merge(
        operators[operator_id] || default(OPERATORS_DEFAULT)
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

  def online_durations_data_map
    new_data = {}

    online_durations.group_by { |o_d| o_d['operator_id'] }.each do |operator_id, o_durations|
      new_data[operator_id] = {
        site_id: o_durations.first['site_id'],
        tot_work_dur: o_durations.sum { |d| d['seconds'] },
        pause_dur: o_durations.reject { |d| AVAILABLE_TYPES.include?(d['type']) }.sum { |d| d['seconds'] },
        avail_dur: o_durations.select { |d| AVAILABLE_TYPES.include?(d['type']) }.sum { |d| d['seconds'] },
        wait_dur: o_durations.select { |d| WAIT_TYPES.include?(d['type']) }.sum { |d| d['seconds'] },
        admin_dur: o_durations.select { |d| ADMIN_TYPES.include?(d['type']) }.sum { |d| d['seconds'] }
      }
    end
    new_data
  end

  def durations_data_map
    new_data = {}

    durations.group_by { |o_d| o_d['operator_id'] }.each do |operator_id, engagements|
      proactive_engagements = engagements.select { |d| d['type'] == 'proactive' }
      reactive_engagements = engagements.select { |d| d['type'] == 'reactive' }

      new_data[operator_id] = {
        site_id: engagements.first['site_id'],
        direct_out_call_cnt: proactive_engagements.sum { |d| d['count'] },
        direct_out_call_dur: proactive_engagements.sum { |d| d['total_duration_in_seconds'] },
        direct_in_call_cnt: reactive_engagements.sum { |d| d['count'] },
        direct_in_call_dur: reactive_engagements.sum { |d| d['total_duration_in_seconds'] }
      }
    end
    new_data
  end
end
