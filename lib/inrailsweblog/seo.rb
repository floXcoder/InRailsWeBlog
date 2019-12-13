# frozen_string_literal: true

class Seo
  def self.generate_sitemap
    if Rails.env.production?
      Rake::Task['sitemap:refresh'].reenable
      Rake::Task['sitemap:refresh'].invoke
    else
      Rake::Task['sitemap:refresh:no_ping'].reenable
      Rake::Task['sitemap:refresh:no_ping'].invoke
    end

    return true
  end
end
