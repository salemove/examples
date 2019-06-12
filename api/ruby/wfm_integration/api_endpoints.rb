module ApiEndpoints
  def queues(site_ids = [])
    endpoint = "#{@options.api}/queues"

    if site_ids.empty?
      [] # Unable to query without site_ids
    else
      recursive_request(endpoint, { site_ids: site_ids }, 'queues')
    end
  end

  def operators(site_ids = [])
    endpoint = "#{@options.api}/operators"

    recursive_request(endpoint, { site_ids: site_ids, include_disabled: true }, 'operators')
  end

  def recursive_request(endpoint, query, data_root, data = [], page = 1)
    request_data = api_request(endpoint, query, page)
    data = data.concat(request_data[data_root])

    if request_data['next_page'].nil?
      data
    else
      data = data.concat(recursive_request(endpoint, query, data_root, data, page + 1))
    end
    data
  end

  def api_request(endpoint, query, page)
    puts "# #{endpoint} \n"
    raw_response = HTTParty.get(
      endpoint, headers: headers, query: query.merge(per_page: 1000, page: page)
    )

    if raw_response.success?
      JSON.parse(raw_response.body)
    else
      raise(RequestError.new, raw_response.to_h.merge(endpoint: endpoint).to_json)
    end
  end

  def headers
    {
      authorization: "Token #{@options.token}",
      content_type: 'application/json',
      accept: 'application/vnd.salemove.v1+json'
    }
  end
end
