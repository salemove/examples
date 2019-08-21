# frozen_string_literal: true

require 'agent_queue_data'
require 'ostruct'

RSpec.describe AgentQueueData, :vcr do
  it 'returns agent queue data' do
    expect(agent_queue_data.call.values).to eq([{
      agent_id: '9a5e3745-c5ed-4818-ba4c-4d52a851027c',
      agent_name: 'WFM Integration Example Operator',
      answ_call_cnt: 1,
      queue: '26835c93-849a-4a36-8e0f-b40d1e2852c2',
      queue_name: 'Main Queue',
      site_id: '7e8aea41-f985-473f-83e3-fba01631acdb',
      talking_call_dur: 9,
      transfer_out_call_cnt: 0,
      wrap_up_dur: 0
    }, {
      agent_id: '9a5e3745-c5ed-4818-ba4c-4d52a851027c',
      agent_name: 'WFM Integration Example Operator',
      answ_call_cnt: 5,
      queue: '6130bc66-58c8-432f-bb18-439af0fbdbed',
      queue_name: 'Fallback Queue',
      site_id: '7e8aea41-f985-473f-83e3-fba01631acdb',
      talking_call_dur: 151,
      transfer_out_call_cnt: 2,
      wrap_up_dur: 17
    }, {
      agent_id: 'e18c24e1-f753-4911-a695-801d2e5279dd',
      agent_name: 'WFM Integration Example Manager',
      answ_call_cnt: 2,
      queue: '6130bc66-58c8-432f-bb18-439af0fbdbed',
      queue_name: 'Fallback Queue',
      site_id: '7e8aea41-f985-473f-83e3-fba01631acdb',
      talking_call_dur: 34,
      transfer_out_call_cnt: 1,
      wrap_up_dur: 0
    }])
  end

  def agent_queue_data
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
