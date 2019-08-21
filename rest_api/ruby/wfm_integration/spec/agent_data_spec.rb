# frozen_string_literal: true

require 'agent_data'
require 'ostruct'

RSpec.describe AgentData, :vcr do
  it 'returns agent data' do
    expect(agent_data.call.values).to eq([{
      admin_dur: 0,
      agent_id: '9a5e3745-c5ed-4818-ba4c-4d52a851027c',
      agent_name: 'WFM Integration Example Operator',
      avail_dur: 1950,
      direct_in_call_cnt: 3,
      direct_in_call_dur: 53,
      direct_out_call_cnt: 3,
      direct_out_call_dur: 106,
      pause_dur: 6,
      site_id: '7e8aea41-f985-473f-83e3-fba01631acdb',
      tot_work_dur: 1956,
      wait_dur: 1791
    }, {
      admin_dur: 874,
      agent_id: 'e18c24e1-f753-4911-a695-801d2e5279dd',
      agent_name: 'WFM Integration Example Manager',
      avail_dur: 1661,
      direct_in_call_cnt: 1,
      direct_in_call_dur: 22,
      direct_out_call_cnt: 3,
      direct_out_call_dur: 133,
      pause_dur: 874,
      site_id: '7e8aea41-f985-473f-83e3-fba01631acdb',
      tot_work_dur: 2535,
      wait_dur: 1153
    }])
  end

  def agent_data
    opts = OpenStruct.new
    opts.api = 'https://api.salemove.com'
    opts.start_date = '2019-08-21T17:00:00Z'
    opts.end_date = '2019-08-21T18:00:00Z'
    opts.site_id = ['7e8aea41-f985-473f-83e3-fba01631acdb']
    opts.token = ENV['TOKEN']
    opts.enable_defaults = true

    described_class.new(opts)
  end
end
