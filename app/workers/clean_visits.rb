# frozen_string_literal: true

class CleanVisits
  include Sidekiq::Worker

  sidekiq_options queue: :default

  def perform
    remove_invalid_visits

    update_rejected_ips
  end

  private

  def remove_invalid_visits
    Ahoy::Visit.all.where('started_at < ?', 1.day.ago).where(validated: false).destroy_all
  end

  def update_rejected_ips
    # Get new IPs to exclude
    new_excluded_ips = remove_bots_visits

    # Combine with previous IPs
    excluded_ips = File.open(Rails.root.join('lib/tracking/excluded_ips.txt')) { |file| file.readlines.map(&:chomp) }
    excluded_ips.concat(new_excluded_ips)

    # Do not exclude my IPs
    if ENV['WHITE_LIST_IP'].present?
      excluded_ips -= ENV['WHITE_LIST_IP'].split(', ')
    end

    # Detect patterns
    excluded_pattern_ips     = File.open(Rails.root.join('lib/tracking/excluded_pattern_ips.txt')) { |file| file.readlines.map(&:chomp) }
    pattern_ips              = excluded_ips.map { |ip| ip.split('.')[0..2].join('.') }
    count_pattern            = pattern_ips.inject(Hash.new(0)) { |h, e| h[e] += 1; h }
    patterns                 = count_pattern.select { |_, v| v > 5 }
    new_excluded_pattern_ips = patterns.keys
    excluded_pattern_ips.concat(new_excluded_pattern_ips)
    excluded_pattern_ips.uniq!
    File.open(Rails.root.join('lib/tracking/excluded_pattern_ips.txt'), 'w') { |file| file.puts(excluded_pattern_ips) }

    # Remove unique IPs included in patterns
    excluded_ips = excluded_ips.reject { |ip| excluded_pattern_ips.include?(ip.split('.')[0..2].join('.')) }
    excluded_ips.uniq!
    File.open(Rails.root.join('lib/tracking/excluded_ips.txt'), 'w') { |file| file.puts(excluded_ips) }
  end

  def remove_bots_visits
    bots_ip = []

    bots_ip.concat(Ahoy::Visit.select(:ip).group(:ip).having('COUNT(ip) > ?', 30).count.keys)

    visits = Ahoy::Visit.all

    bots_ip.concat(visits.where('landing_page ~* ?', '\.php').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', '\?php').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', '\.aspx').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', '\.sql').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', '\.bz2').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', '\.xml').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', '\.xz').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', '\.gif').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', '\.ico').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', '\.abe').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', '\.start').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', 'var_dump').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', 'wordpress').pluck(:ip))
    bots_ip.concat(visits.where('landing_page ~* ?', 'wp').pluck(:ip))

    bots_ip.concat(visits.where('user_agent ~* ?', 'OkHttp').pluck(:ip))
    bots_ip.concat(visits.where('user_agent ~* ?', 'Wget').pluck(:ip))
    bots_ip.concat(visits.where('user_agent ~* ?', 'spray-can').pluck(:ip))
    bots_ip.concat(visits.where('user_agent ~* ?', 'Amazon CloudFront').pluck(:ip))
    bots_ip.concat(visits.where('user_agent ~* ?', 'ShortLinkTranslate').pluck(:ip))
    bots_ip.concat(visits.where('user_agent ~* ?', 'ShortLinkTranslate').pluck(:ip))
    bots_ip.concat(visits.where('user_agent ~* ?', 'Apache-HttpClient').pluck(:ip))
    bots_ip.concat(visits.where(user_agent: nil).pluck(:ip))

    visits.where(ip: bots_ip).destroy_all

    return bots_ip.uniq.map { |ip| ip.sub('::ffff:', '') }
  end

end
