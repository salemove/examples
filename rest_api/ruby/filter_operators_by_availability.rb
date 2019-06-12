#!/usr/bin/ruby

require 'rubygems'
require 'rest_client'
require 'json'

headers = {
  :authorization: 'Token MY_SECRET_API_TOKEN',
  :accept: 'application/vnd.salemove.v1+json'
}

def get_available_operators(operator_data)
  operator_data['operators'].select { |operator| operator['available'] }
end

response = RestClient.get 'https://api.salemove.com/operators', headers

operator_data = JSON.parse response

available_operators = get_available_operators operator_data

puts available_operators
