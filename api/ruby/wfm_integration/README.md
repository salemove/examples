# WFM integration example

This is an example of WFM integration. It shows how data from different Glia statistics endpoints can be combined to provide a custom view of staffing levels and demand.

## Installation

Clone or download repository and navigate to project folder
```bash
gem install bundler
bundle install
```

## Usage

```bash
ruby script.rb --script=agent --token=TOKEN
```

For more information and other commands and parameters:
```bash
ruby script.rb --help
```

Available parameters:
```bash
--script=SCRIPT              # Script to run [agent, agent_queue, queue]
--token=TOKEN                # Auth token
--start=START                # Start date UTC (iso8601)
--end=END                    # End date UTC (iso8601)
--type=TYPE                  # Engagement type [chat, voice, all] (Default: all)
--site=SITE_ID               # Specify site_id(s) (Comma separated)
--operator=OPERATOR_ID       # Specify operator_id(s) (Only agent and agent_queue) (Comma separated)
--queue=QUEUE_ID             # Specify queue_id(s) (Only queue and agent_queue) (Comma separated)
--disable-defaults           # Disable defaults (Default: false)
--debug                      # Debug script by showing raw results from endpoints
```

## Examples

### Queue data for all media types
```bash
ruby script.rb --script=queue --token=TOKEN
```

Output:
```bash
[{:queue=>"2400ec6f-f276-4329-bcda-87a3b8f74ae9",
  :site_id=>"24c9802c-3b95-4a15-b366-342b0a8289f7",
  :wrap_up_dur=>30,
  :talking_call_dur=>10,
  :overflow_out_call_cnt=>1,
  :offd_direct_call_cnt=>0,
  :aband_call_cnt=>0,
  :queued_and_aband_call_dur=>0,
  :queued_aband_longest_que_dur=>0,
  :answ_call_cnt=>0,
  :queued_and_answ_call_dur=>0,
  :queued_answ_longest_que_dur=>0,
  :ans_servicelevel_cnt=>0,
  :aband_short_call_cnt=>0,
  :aband_within_sl_cnt=>0,
  :overflow_in_call_cnt=>0,
  :queue_name=>"Technical support queue (text)"}]
```

### Agent data for chat
```bash
ruby script.rb --script=agent --type=chat --token=TOKEN
```

Output:
```bash
[{:agent_id=>"38f93ea1-1fe5-42c1-a312-8856e2b95611",
  :site_id=>"24c9802c-3b95-4a15-b366-342b0a8289f7",
  :direct_out_call_cnt=>3,
  :direct_out_call_dur=>15,
  :direct_in_call_cnt=>5,
  :direct_in_call_dur=>39,
  :tot_work_dur=>10228,
  :pause_dur=>0,
  :avail_dur=>10228,
  :wait_dur=>9985,
  :admin_dur=>0,
  :agent_name=>"John Doe"}]
```

### Agent - Queue data for voice

```bash
ruby script.rb --script=agent_queue --type=voice --token=TOKEN
```

Output:
```bash
[{:agent_id=>"44b49db6-c84d-455e-849f-0d156d027eba",
  :queue=>"2400ec6f-f276-4329-bcda-87a3b8f74ae9",
  :site_id=>"24c9802c-3b95-4a15-b366-342b0a8289f7",
  :answ_call_cnt=>2,
  :talking_call_dur=>10,
  :transfer_out_call_cnt=>1,
  :wrap_up_dur=>0,
  :agent_name=>"John Doe",
  :queue_name=>"Customer service queue (rich media)"},
 {:agent_id=>"44b49db6-c84d-455e-849f-0d156d027eba",
  :queue=>"8baef340-1326-4086-b931-792bc29eae9a",
  :site_id=>"24c9802c-3b95-4a15-b366-342b0a8289f7",
  :answ_call_cnt=>2,
  :talking_call_dur=>10,
  :transfer_out_call_cnt=>1,
  :wrap_up_dur=>0,
  :agent_name=>"John Doe",
  :queue_name=>"Technical support queue (rich media)"}]
```
