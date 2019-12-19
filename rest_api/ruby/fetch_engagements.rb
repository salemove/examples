#!/usr/bin/ruby

require 'net/http'
require 'json'

# Bearer token
TOKEN = "eyJhbGciOiJIU<...truncated>"

def fetch_engagements(uri)
  res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
    # Prepare request with headers
    request = Net::HTTP::Get.new(uri)
    request['Accept'] = 'application/vnd.salemove.v1+json'
    request['Authorization'] = "Bearer #{TOKEN}"

    # Make request
    http.request(request)
  end

  # Returns response body if request is successful
  return res.body if res.is_a?(Net::HTTPSuccess)

  # Prints out the error
  puts res.body
  # Raises error to stop execution
  raise StandardError
end

all_engagements = []

# Setup first query
next_uri = URI('https://api.salemove.com/engagements')
next_uri.query = 'site_ids[]=24c9802c-3b95-4a15-b366-342b0a8289f7&per_page=100'

# While next_uri is provided
while next_uri
  # Fetch engagements
  result = JSON.parse(fetch_engagements(next_uri))
  engagements = result['engagements']
  # Append engagements to all_engagements array
  all_engagements += engagements

  # If next_page is present then continue with next_page provided by API
  # Else ends the loop
  next_uri = result['next_page'] ? URI(result['next_page']) : nil
end

# Prints out the amount of all engagements
puts all_engagements.count
