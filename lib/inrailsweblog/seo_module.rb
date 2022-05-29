# frozen_string_literal: true

class SeoModule
  def self.generate_sitemap
    Rake::Task['sitemap:refresh:no_ping'].reenable
    Rake::Task['sitemap:refresh:no_ping'].invoke

    return true
  end
end
