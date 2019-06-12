module StatisticsEndpoints
  def online_durations
    endpoint = "#{@options.api}/operators/stats/online_duration"
    engagement_type_filters = {
      voice_filter: nil,
      chat_filter: nil
    }
    stats_requeset(
      endpoint, requests[:online_durations][:fields], requests[:online_durations][:dimensions], engagement_type_filters
    )
  end

  def durations
    endpoint = "#{@options.api}/engagements/stats/duration"
    engagement_type_filters = {
      voice_filter: voice_engagement_filter,
      chat_filter: chat_engagement_filter
    }
    stats_requeset(endpoint, requests[:durations][:fields], requests[:durations][:dimensions], engagement_type_filters)
  end

  def wait_durations
    endpoint = "#{@options.api}/engagements/stats/queue/wait_duration"
    engagement_type_filters = {
      voice_filter: voice_engagement_filter2,
      chat_filter: chat_engagement_filter2
    }
    stats_requeset(
      endpoint, requests[:wait_durations][:fields], requests[:wait_durations][:dimensions], engagement_type_filters
    )
  end

  def post_durations
    endpoint = "#{@options.api}/engagements/stats/post_engagement_duration"
    engagement_type_filters = {
      voice_filter: voice_engagement_filter,
      chat_filter: chat_engagement_filter
    }
    stats_requeset(
      endpoint, requests[:post_durations][:fields], requests[:post_durations][:dimensions], engagement_type_filters
    )
  end

  def stats_requeset(endpoint, fields, dimensions, engagement_type_filters)
    fields << site_id_present_filter # Filter that does nothing, but needed if none of the other filters apply
    fields << engagement_type_filters[:voice_filter] if voice?
    fields << engagement_type_filters[:chat_filter] if chat?
    fields = fields.compact

    puts "# #{endpoint} \n"

    raw_response = HTTParty.post(
      endpoint, options(fields.compact, dimensions)
    )
    if raw_response.success?
      JSON.parse(raw_response.body).select do |obj|
        # Records can have multiple queue_ids and queue_ids are persisted as an Array.
        # When filtering by queue_id those records with multiple queue_ids will be included
        # When grouped by queue_id it will include those same records twice with different queue_id
        # and it would look like filter didn't work, but it did. Rejecting record with incorrect queue_id.
        @options.queue_id.nil? || obj['queue_id'].nil? || Array(@options.queue_id).include?(obj['queue_id'])
      end
    else
      raise(
        RequestError.new,
        raw_response.to_h.merge(
          endpoint: endpoint,
          fields: fields,
          dimensions: dimensions
        ).to_json
      )
    end
  end

  def options(fields, dimensions)
    {
      headers: {
        authorization: "Token #{@options.token}",
        content_type: 'application/json',
        accept: 'application/vnd.salemove.v1+json'
      },
      query: {
        query_type: 'group_by',
        dimensions: dimensions,
        granularity: 'all',
        start_date: @options.start_date,
        end_date: @options.end_date,
        filter: {
          type: 'and',
          fields: fields
        }
      }
    }
  end
end
