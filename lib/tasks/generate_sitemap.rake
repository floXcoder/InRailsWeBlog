# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:generate_sitemap
  desc 'Generate SEO sitemap xml files'
  task :generate_sitemap, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new($stdout)
    Rails.logger.level = Logger::INFO

    Rake.application.invoke_task('sitemap:refresh:no_ping')

    # Rake::Task['sitemap:refresh:no_ping'].reenable
    # Rake::Task['sitemap:refresh:no_ping'].invoke

    Rails.logger.warn("#{Time.zone.now} : Generate sitemap task DONE")
  end

end
