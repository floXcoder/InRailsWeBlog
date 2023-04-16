# frozen_string_literal: true

Geocoder.configure(
  # Geocoding options
  timeout: InRailsWeBlog.settings.geocoding_timeout, # geocoding service timeout (secs)
  language: :en, # ISO-639 language code
  use_https: true, # use HTTPS for lookup requests? (if supported)

  # IP address geocoding service
  ip_lookup: :geoip2,
  geoip2:    {
    file: Rails.root.join('lib/geocoding/ip_db/GeoLite2-City.mmdb')
  },

  # Caching
  cache: Rails.env.test? ? nil : Redis.new(host: ENV['REDIS_HOST'], port: ENV['REDIS_PORT'], db: ENV['REDIS_DB'].to_i), # cache object (must respond to #[], #[]=, and #keys)
  cache_options: {
    expiration: InRailsWeBlog.settings.cache_time, # Redis ttl
    prefix: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:geocoder:" # prefix (string) to use for all cache keys
  },

  # calculation options
  units: :km, # :km for kilometers or :mi for miles
  distances: :spherical, # :spherical or :linear
  logger: Rails.logger
)
