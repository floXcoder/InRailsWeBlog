# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:clean_visits
  desc 'Clean user visits'
  task :clean_visits, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::INFO

    CleanVisits.new.perform

    # Remove visits from excluded IPs
    # ips = File.open(Rails.root.join('lib/tracking/excluded_ips.txt')) { |file| file.readlines.map(&:chomp) }
    # Ahoy::Visit.where(ip: ips).count

    # Display suspicious visits details
    # Ahoy::Visit.where(referring_domain: 'www.google.com').last(200).each { |v| p [v.ip, v.user_agent, v.referrer, v.events_count, v.browser, v.country ] }

    # Update article visits
    # Article.includes(:tracker).everyone.each { |article| article.tracker.update(visits_count: Ahoy::Event.where(name: 'page_visit').where("properties->>'article_id' = ?", article.id.to_s).includes(:visit).map { |e| e.visit&.visit_token }.uniq.compact.count) }

    Rails.logger.warn("#{Time.zone.now} : Clean user visits DONE")
  end

end
