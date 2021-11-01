# frozen_string_literal: true

require 'zlib'

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:update_geolite_db
  desc 'Update Geolite2 City database'
  task :update_geolite_db do
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::WARN
    Rails.logger.warn("#{Time.now} : Update Geolite task")

    geolite_database = Rails.root.join('lib/geocoding/ip_db/GeoLite2-City.mmdb')

    # old_url = 'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz'
    db_url = "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=#{ENV['MAXMIND_KEY']}&suffix=tar.gz"
    puts db_url
    Zlib::GzipReader.open(URI.parse(db_url).open) do |gz|
      File.open(geolite_database, 'wb') { |file| file.write(gz.read) }
    end
  end

end
