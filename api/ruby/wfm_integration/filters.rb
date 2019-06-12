module Filters
  def site_id_filter
    filter_helper('site_id')
  end

  def queue_id_filter
    filter_helper('queue_id')
  end

  def operator_id_filter
    filter_helper('operator_id')
  end

  def site_id_present_filter
    {
      'field': {
        'type': 'selector',
        'dimension': 'site_id',
        'value': ''
      },
      'type': 'not'
    }
  end

  def queue_id_present_filter
    {
      'field': {
        'type': 'selector',
        'dimension': 'queue_id',
        'value': ''
      },
      'type': 'not'
    }
  end

  def queue_id_missing_filter
    {
      'type': 'selector',
      'dimension': 'queue_id',
      'value': ''
    }
  end

  def voice_engagement_filter
    {
      'type': 'in',
      'dimension': 'highest_operator_media',
      'values': %w[audio video]
    }
  end

  def voice_engagement_filter2
    {
      'type': 'in',
      'dimension': 'media',
      'values': %w[audio video]
    }
  end

  def chat_engagement_filter
    {
      'type': 'selector',
      'dimension': 'highest_operator_media',
      'value': 'chat'
    }
  end

  def chat_engagement_filter2
    {
      'type': 'selector',
      'dimension': 'media',
      'value': 'chat'
    }
  end

  def user_type_filter
    {
      'type': 'selector',
      'dimension': 'user_type',
      'value': 'operator'
    }
  end

  private

  def filter_helper(param)
    return unless (value = @options.public_send(param))

    {
      'type': 'in',
      'dimension': param,
      'values': value
    }
  end
end
