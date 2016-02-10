#!/usr/bin/ruby

require 'rubygems'
require 'rest_client'

@headers = {
  :authorization: 'SessionId REPLACE_ME',
  :accept: 'application/vnd.salemove.v1+json',
  :x_salemove_visit_session_id: 'REPLACE_ME'
}

def set_visitor_custom_attribute(attribute, value)
  values = {
    'note_update_method': 'append',
    'custom_attributes': {
      '#{attribute}': '#{value}'
    }
  }
  RestClient.post 'https://api.salemove.com', values, @headers
end

response = set_visitor_custom_attribute("home_address", "Winston")
puts response
