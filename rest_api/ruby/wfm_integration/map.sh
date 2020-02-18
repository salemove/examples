#!/bin/bash
set -euo pipefail

jq -r '
  ["interval_lenght (min)","date (YYYYMMDD)","time (hh:mm)","queue_id","queue_name","offered_calls","overflow_in_calls","abandoned_calls","overflow_out_calls","answered_calls","speed_of_answer_s","time_to_abandon_s","talk_time_s","after_call_work_s","longest_delay_in_queue_answered_s","longest_delay_in_queue_abandoned_s","avg_avail_member_cnt","answered_calls_within_SL","idle_dur_s","abandoned_short_calls","abandoned_calls_within_SL"] as $cols |
  {
    "queue_id": "queue",
    "queue_name": "queue_name",
    "offered_calls": "offd_direct_call_cnt",
    "overflow_in_calls": "overflow_in_call_cnt",
    "abandoned_calls": "aband_call_cnt",
    "overflow_out_calls": "overflow_out_call_cnt",
    "answered_calls": "answ_call_cnt",
    "speed_of_answer_s": "queued_and_answ_call_dur",
    "time_to_abandon_s": "queued_and_aband_call_dur",
    "talk_time_s": "talking_call_dur",
    "after_call_work_s": "wrap_up_dur",
    "longest_delay_in_queue_answered_s": "queued_answ_longest_que_dur",
    "longest_delay_in_queue_abandoned_s": "queued_aband_longest_que_dur",
    "answered_calls_within_SL": "ans_servicelevel_cnt",
    "abandoned_short_calls": "aband_short_call_cnt",
    "abandoned_calls_within_SL": "aband_within_sl_cnt"
  } as $mapping |
  def get_val($row; $col_name):
    if $col_name == "interval_lenght (min)" then
      15
    elif $col_name == "date (YYYYMMDD)" then
      $row["date"] as $x | "\($x[0:4])\($x[5:7])\($x[8:10])"
    elif $col_name == "time (hh:mm)" then
      $row["date"][11:16]
    elif $col_name == "speed_of_answer_s" then
      if ($row["answ_call_cnt"] // 0) == 0 then
        0
      else
        $row["queued_and_answ_call_dur"] / $row["answ_call_cnt"] | round
      end
    elif $col_name == "time_to_abandon_s" then
      if ($row["aband_call_cnt"] // 0) == 0 then
        0
      else
        $row["queued_and_aband_call_dur"] / $row["aband_call_cnt"] | round
      end
    else
      $row[$mapping[$col_name] // "x"] // 0
    end
  ;
  map(. as $row | $cols | map(get_val($row; .))) as $rows |
  $cols, $rows[] |
  @csv
'
