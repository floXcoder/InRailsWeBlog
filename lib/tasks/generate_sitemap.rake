# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:generate_sitemap
  desc 'Reset and migrate the database the database, initialize with the seed data and reindex models for search'
  task :generate_sitemap, [:mode] => :environment do |_, args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.warn("#{Time.now} : Generate sitemap task")

    ::Seo.generate_sitemap
  end

end
