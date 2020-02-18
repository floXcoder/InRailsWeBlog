# frozen_string_literal: true

require 'zlib'
require 'open-uri'

namespace :InRailsWeBlog do

  desc 'Update Geolite2 City database'
  task :update_geolite do
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::WARN
    Rails.logger.warn("#{Time.now} : Update Geolite task")

    geolite_database = Rails.root.join('lib', 'geocoding', 'ip_db', 'GeoLite2-City.mmdb')

    url = 'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz'
    Zlib::GzipReader.open(open(url)) do |gz|
      File.open(geolite_database, 'wb') { |file| file.write(gz.read) }
    end
  end

end
