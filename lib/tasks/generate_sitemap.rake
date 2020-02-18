# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:generate_sitemap
  desc 'Generate SEO sitemap xml files'
  task :generate_sitemap, [:mode] => :environment do |_, args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.warn("#{Time.now} : Generate sitemap task")

    ::Seo.generate_sitemap
  end

end
