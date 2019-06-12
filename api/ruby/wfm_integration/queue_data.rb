require_relative './stats_request.rb'

class QueueData < StatsRequest
  ABANDONED_OUTCOMES = %w[canceled disconnected].freeze
  FINISED_OUTCOMES = %w[finished].freeze
  DURATIONS_DEFAULT = {
    talking_call_dur: 0,
    overflow_out_call_cnt: 0
  }.freeze
  WAIT_DURATIONS_DEFAULT = {
    offd_direct_call_cnt: 0,
    aband_call_cnt: 0,
    queued_and_aband_call_dur: 0,
    queued_aband_longest_que_dur: 0,
    answ_call_cnt: 0,
    queued_and_answ_call_dur: 0,
    queued_answ_longest_que_dur: 0,
    ans_servicelevel_cnt: 0,
    aband_short_call_cnt: 0,
    aband_within_sl_cnt: 0,
    overflow_in_call_cnt: 0
  }.freeze
  POST_DURATIONS_DEFAULT = {
    wrap_up_dur: 0
  }.freeze
  QUEUES_DEFAULT = {
    queue_name: 'Unknown Queue'
  }.freeze

  def requests
    {
      durations: {
        fields: [site_id_filter, queue_id_filter, queue_id_present_filter],
        dimensions: %w[site_id queue_id end_reason]
      },
      wait_durations: {
        fields: [site_id_filter, queue_id_filter, queue_id_present_filter],
        dimensions: %w[site_id queue_id outcome from_transfer]
      },
      post_durations: {
        fields: [site_id_filter, queue_id_filter, user_type_filter, queue_id_present_filter],
        dimensions: %w[site_id queue_id type highest_operator_media]
      },
      queues: {}
    }
  end

  def call
    post_durations = post_durations_data_map
    durations = durations_data_map
    wait_durations = wait_durations_data_map

    result = {}
    queue_ids = post_durations.keys.concat(durations.keys).concat(wait_durations.keys)
    site_ids = post_durations.values.map { |d| d[:site_id] }.concat(
      durations.values.map { |d| d[:site_id] }
    ).concat(
      wait_durations.values.map { |d| d[:site_id] }
    ).uniq

    queues = queues_data_map(site_ids)

    queue_ids.each do |queue_id|
      result[queue_id] = {
        queue: queue_id
      }.merge(
        post_durations[queue_id] || default(POST_DURATIONS_DEFAULT)
      ).merge(
        durations[queue_id] || default(DURATIONS_DEFAULT)
      ).merge(
        wait_durations[queue_id] || default(WAIT_DURATIONS_DEFAULT)
      ).merge(
        queues[queue_id] || default(QUEUES_DEFAULT)
      )
    end
    result
  end

  private

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

    durations.group_by { |w_d| w_d['queue_id'] }.each do |queue_id, grouped_durations|
      to_transfer_calls = grouped_durations.select { |w_d| w_d['end_reason'] == 'transfer' }

      new_data[queue_id] = {
        site_id: grouped_durations.first['site_id'],
        talking_call_dur: grouped_durations.sum { |g_d| g_d['total_duration_in_seconds'] },
        overflow_out_call_cnt: to_transfer_calls.sum { |w_d| w_d['count'] }
      }
    end

    new_data
  end

  def wait_durations_data_map
    new_data = {}

    wait_durations.group_by { |w_d| w_d['queue_id'] }.each do |queue_id, w_durations|
      answered_calls = w_durations.select { |w_d| FINISED_OUTCOMES.include?(w_d['outcome']) }
      abandoned_calls = w_durations.select { |w_d| ABANDONED_OUTCOMES.include?(w_d['outcome']) }
      from_transfer_calls = w_durations.select { |w_d| w_d['from_transfer'] }

      aband_service_level_cnt = abandoned_calls.sum { |w_d| w_d['within_service_level_count'] }
      aband_short_call_cnt = abandoned_calls.sum { |w_d| w_d['short_duration_count'] }

      new_data[queue_id] = {
        site_id: w_durations.first['site_id'],
        offd_direct_call_cnt: w_durations.sum { |w_d| w_d['count'] },
        aband_call_cnt: abandoned_calls.sum { |w_d| w_d['count'] },
        queued_and_aband_call_dur: abandoned_calls.sum { |w_d| w_d['total_duration_in_seconds'] },
        queued_aband_longest_que_dur: abandoned_calls.map { |w_d| w_d['maximum_duration_in_seconds'] }.max,
        answ_call_cnt: answered_calls.sum { |w_d| w_d['count'] },
        queued_and_answ_call_dur: answered_calls.sum { |w_d| w_d['total_duration_in_seconds'] },
        queued_answ_longest_que_dur: answered_calls.map { |w_d| w_d['maximum_duration_in_seconds'] }.max,
        ans_servicelevel_cnt: answered_calls.sum { |w_d| w_d['within_service_level_count'] },
        aband_short_call_cnt: aband_short_call_cnt,
        aband_within_sl_cnt: aband_service_level_cnt - aband_short_call_cnt,
        overflow_in_call_cnt: from_transfer_calls.sum { |w_d| w_d['count'] }
      }
    end

    new_data
  end

  def post_durations_data_map
    new_data = {}

    post_durations.group_by { |w_d| w_d['queue_id'] }.each do |queue_id, p_durations|
      new_data[queue_id] = {
        site_id: p_durations.first['site_id'],
        wrap_up_dur: p_durations.sum { |w_d| w_d['seconds'] }
      }
    end

    new_data
  end
end
