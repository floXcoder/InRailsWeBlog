# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:generate_sitemap
  desc 'Generate SEO sitemap xml files'
  task :generate_sitemap, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::WARN
    Rails.logger.warn("#{Time.now} : Generate sitemap task")

    ::SeoModule.generate_sitemap
  end

end
