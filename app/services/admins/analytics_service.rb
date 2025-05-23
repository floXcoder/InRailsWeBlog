# frozen_string_literal: true

require 'net/http'

module Admins
  class AnalyticsService < BaseService
    include VisitHelper

    EXCLUDED_USER_IDS = [1, 2, 3].freeze

    SOCIAL_DOMAINS =     %w[m.facebook.com www.facebook.com l.instagram.com www.pinterest.com l.facebook.com www.linkedin.com instagram.com lm.facebook.com pinterest.com www.pinterest.co.kr www.pinterest.jp www.pinterest.fr www.premiere.fr www.youtube.com youtube.com www.pinterest.fr www.pinterest.ch co.pinterest.com www.pinterest.ca www.pinterest.co.uk].freeze

    SEARCH_DOMAINS = %w[www.google.com www.google.fr www.google.co.uk www.bing.com fr.search.yahoo.com www.google.be www.ecosia.org www.google.ca www.google.ch www.qwant.com www.google.dk search.lilo.org search.uselilo.org www.google.lu r.search.yahoo.com www.google.pt www.google.co.ma www.google.co.jp www.google.de r.search.aol.com www.google.sk www.google.it www.google.es cse.google.com www.google.com.co www.google.com.hk duckduckgo.com www.google.com.au baidu.com www.qoqotte.com cn.bing.com tineye.com www.google.com.ar www.google.se recherche.aol.fr int.search.myway.com search.myway.com www.google.pl www.google.nl www.google.com.br www.google.at www.google.co.nz www.google.fi www.google.gr www.google.ru search.yahoo.com lite.qwant.com www.google.no www.google.ro www.google.com.tr www.google.cl www.google.com.mx www.google.com.pa www.google.co.in search.becovi.com nortonsafe.search.ask.com lemoteur.orange.fr www.google.co.za www.google.co.kr www.google.com.mx www.google.hn www.google.com.pa www.startpage.com].freeze

    def detail_visits(params)
      if params[:date]
        visits = Ahoy::Visit.validated.external(EXCLUDED_USER_IDS).where(started_at: Date.parse(params[:date]).all_day).order('started_at DESC')
        Admin::VisitSerializer.new(visits).serializable_hash&.dig(:data)&.pluck(:attributes)
      else
        []
      end
    end

    def global_visits(top_limit: 25)
      visits_details = {}

      visits_details[:dates] = Ahoy::Visit.validated.external(EXCLUDED_USER_IDS).order('DATE(started_at) DESC').group('DATE(started_at)').limit(60).count

      uniq_visits = Ahoy::Visit.validated.external(EXCLUDED_USER_IDS).select(%w[DISTINCT(visitor_token) user_agent referrer pages_count referring_domain browser os device_type country city landing_page takeoff_page utm_source utm_medium utm_content utm_campaign started_at ended_at]).to_a
      # .where(:started_at.gte => start_date, :started_at.lte => end_date)

      visits_details[:totalUniqVisits]    = uniq_visits.count
      visits_details[:totalArticleVisits] = Tracker.where(tracked_type: 'Article').sum(:visits_count)
      visits_details[:totalClicks]        = Tracker.where(tracked_type: 'Article').sum(:clicks_count)
      # visits_details[:totalViews]         = Tracker.where(tracked_type: 'Article').sum(:views_count)
      # visits_details[:totalQueries]    = Tracker.sum(:queries_count)
      # visits_details[:totalSearches]   = Tracker.sum(:searches_count)

      visits_details[:topArticles] = Tracker.where(tracked_type: 'Article', visits_count: 1...).order('visits_count DESC').joins(:article).where(article: { visibility: 'everyone' }).limit(top_limit).map { |tracker| { id: tracker.tracked_id, name: tracker.tracked.title, date: I18n.l(tracker.tracked.created_at, format: :custom_full_date).sub(/^0+/, ''), link: tracker.tracked.link_path(locale: I18n.locale), count: tracker.visits_count } }
      visits_details[:topTags]     = Tracker.where(tracked_type: 'Tag', visits_count: 1...).order('visits_count DESC').joins(:tag).where(tag: { visibility: 'everyone' }).limit(top_limit).map { |tracker| { id: tracker.tracked_id, name: tracker.tracked.name, link: tracker.tracked.link_path(locale: I18n.locale), count: tracker.visits_count } }
      visits_details[:topTopics]   = Tracker.where(tracked_type: 'Topic', visits_count: 1...).order('visits_count DESC').joins(:topic).where(topic: { visibility: 'everyone' }).limit(top_limit).map { |tracker| { id: tracker.tracked_id, name: tracker.tracked.name, link: tracker.tracked.link_path(locale: I18n.locale), count: tracker.visits_count } }

      visits_details[:totalArticles] = Article.everyone.count
      visits_details[:totalTags]     = Tag.everyone.count
      visits_details[:totalTopics]   = Topic.everyone.count

      visits_details[:bounceRate]   = uniq_visits.count > 0 ? (uniq_visits.count { |v| v.pages_count < 2 }.to_f / uniq_visits.count).round(2) * 100 : 0
      median_duration               = median(uniq_visits.select { |visit| visit.ended_at && visit.started_at && visit.pages_count > 1 }.map { |visit| visit.ended_at - visit.started_at })
      visits_details[:duration]     = median_duration ? Time.zone.at(median_duration).strftime('%Mmin %Ssec').sub(/^0/, '') : nil
      visits_details[:averagePages] = (uniq_visits.reduce(0) { |sr, visit| sr + visit.pages_count }.to_f / uniq_visits.count).round(2)

      # direct_source_count = uniq_visits.count { |visit| visit.referrer.nil? }
      # social_source_count = uniq_visits.count { |visit| social_domains.include?(visit.referring_domain) }
      # search_source_count = uniq_visits.count { |visit| search_domains.include?(visit.referring_domain) }
      # utm_source_count    = uniq_visits.count { |visit| visit.referrer.present? && visit.utm_source.present? && !search_domains.include?(visit.referring_domain) && !social_domains.include?(visit.referring_domain) }
      # other_source_count  = uniq_visits.count - direct_source_count - social_source_count - search_source_count - utm_source_count
      # visits_details[:sources] = {
      #   direct: direct_source_count,
      #   social: social_source_count,
      #   search: search_source_count,
      #   utm:    utm_source_count,
      #   other:  other_source_count
      # }.sort_by { |_k, v| -v }.to_h

      visits_details[:countries]  = format_tracking(uniq_visits.group_by(&:country), top_limit)
      visits_details[:browsers]   = format_tracking(uniq_visits.group_by(&:browser), top_limit)
      visits_details[:os]         = format_tracking(uniq_visits.group_by(&:os), top_limit)
      visits_details[:utmSources] = format_tracking(uniq_visits.group_by(&:utm_source), top_limit)
      visits_details[:devices]    = format_tracking(uniq_visits.group_by(&:device_type), top_limit)
      visits_details[:referrers]  = format_tracking(uniq_visits.group_by(&:referring_domain), top_limit)

      # visits_details[:utms] = format_tracking(uniq_visits.group_by { |visit| [visit.utm_source, visit.utm_medium, visit.utm_campaign].map(&:presence).compact.join('-') }.delete_if { |k, _v| k.blank? })

      return visits_details
    end

    private

    def median(array)
      return nil if array.empty?

      sorted = array.sort
      len    = sorted.length
      (sorted[(len - 1) / 2] + sorted[len / 2]) / 2.0
    end

  end
end
