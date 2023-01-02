# frozen_string_literal: true

require 'zlib'

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:update_geolite_db
  desc 'Update Geolite2 City database'
  task :update_geolite_db do
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::INFO

    geolite_database_path = Rails.root.join('lib/geocoding/ip_db')

    %x(/usr/bin/curl -L --silent 'https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=#{ENV['MAXMIND_KEY']}&suffix=tar.gz' | /bin/tar -C '#{geolite_database_path}' -xvz --keep-newer-files --strip-components=1 --wildcards '*GeoLite2-City.mmdb')

    Rails.logger.warn("#{Time.now} : Update Geolite task DONE")
  end

end
