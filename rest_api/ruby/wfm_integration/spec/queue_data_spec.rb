# frozen_string_literal: true

require 'queue_data'
require 'ostruct'

RSpec.describe QueueData, :vcr do
  it 'returns queue data' do
    expect(queue_data.call.values).to eq([{
      aband_call_cnt: 0,
      aband_short_call_cnt: 0,
      aband_within_sl_cnt: 0,
      ans_servicelevel_cnt: 5,
      answ_call_cnt: 5,
      offd_direct_call_cnt: 5,
      overflow_in_call_cnt: 5,
      overflow_out_call_cnt: 3,
      queue: '6130bc66-58c8-432f-bb18-439af0fbdbed',
      queue_name: 'Fallback Queue',
      queued_aband_longest_que_dur: nil,
      queued_and_aband_call_dur: 0,
      queued_and_answ_call_dur: 111,
      queued_answ_longest_que_dur: 53,
      site_id: '7e8aea41-f985-473f-83e3-fba01631acdb',
      talking_call_dur: 185,
      wrap_up_dur: 17
    }, {
      aband_call_cnt: 0,
      aband_short_call_cnt: 0,
      aband_within_sl_cnt: 0,
      ans_servicelevel_cnt: 1,
      answ_call_cnt: 1,
      offd_direct_call_cnt: 2,
      overflow_in_call_cnt: 2,
      overflow_out_call_cnt: 0,
      queue: '26835c93-849a-4a36-8e0f-b40d1e2852c2',
      queue_name: 'Main Queue',
      queued_aband_longest_que_dur: nil,
      queued_and_aband_call_dur: 0,
      queued_and_answ_call_dur: 32,
      queued_answ_longest_que_dur: 32,
      site_id: '7e8aea41-f985-473f-83e3-fba01631acdb',
      talking_call_dur: 9,
      wrap_up_dur: 0
    }, {
      aband_call_cnt: 0,
      aband_short_call_cnt: 0,
      aband_within_sl_cnt: 0,
      ans_servicelevel_cnt: 1,
      answ_call_cnt: 1,
      offd_direct_call_cnt: 1,
      overflow_in_call_cnt: 1,
      overflow_out_call_cnt: 0,
      queue: 'e1afb739-6dbb-4b6b-a621-faee8a958a93',
      queue_name: 'Unknown Queue',
      queued_aband_longest_que_dur: nil,
      queued_and_aband_call_dur: 0,
      queued_and_answ_call_dur: 23,
      queued_answ_longest_que_dur: 23,
      site_id: '7e8aea41-f985-473f-83e3-fba01631acdb',
      talking_call_dur: 0,
      wrap_up_dur: 0
    }])
  end

  def queue_data
    opts = OpenStruct.new
    opts.api = 'https://api.salemove.com'
    opts.start_date = '2019-08-21T18:00:00Z'
    opts.end_date = '2019-08-21T19:00:00Z'
    opts.site_id = ['7e8aea41-f985-473f-83e3-fba01631acdb']
    opts.token = ENV['TOKEN']
    opts.enable_defaults = true

    described_class.new(opts)
  end
end
