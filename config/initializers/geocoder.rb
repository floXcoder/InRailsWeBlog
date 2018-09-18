# frozen_string_literal: true

Geocoder.configure(
  # geocoding options
  timeout:      5, # geocoding service timeout (secs)
  language:     :fr, # ISO-639 language code
  use_https:    true, # use HTTPS for lookup requests? (if supported)

  cache:        Redis.new, # cache object (must respond to #[], #[]=, and #keys)
  cache_prefix: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:geocoder:", # prefix (string) to use for all cache keys

  ip_lookup:    :geoip2,
  geoip2:       {
    file: Rails.root.join('lib', 'geocoding', 'ip_db', 'GeoLite2-City.mmdb')
  },

  # calculation options
  units:        :km, # :km for kilometers or :mi for miles
  distances:    :spherical, # :spherical or :linear
  logger:       Rails.logger
)
