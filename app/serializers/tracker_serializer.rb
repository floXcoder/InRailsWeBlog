# frozen_string_literal: true

class TrackerSerializer
  include FastJsonapi::ObjectSerializer

  set_key_transform :camel_lower

  attributes :views_count,
             :queries_count,
             :searches_count,
             :clicks_count
end
