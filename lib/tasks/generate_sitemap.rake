# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:generate_sitemap
  desc 'Reset and migrate the database the database, initialize with the seed data and reindex models for search'
  task :seo, [:mode] => :environment do |_, args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.warn("#{Time.now} : Generate sitemap task")

    InRailsWeBlog::SEO.generate_sitemap
  end

end
