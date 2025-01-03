# frozen_string_literal: true

module CacheService

  def component_cache(name, &block)
    if caching_enabled?
      Rails.cache.fetch(component_cache_path(name), expires_in: InRailsWeBlog.settings.cache_time, &block)
    else
      yield
    end
  end

  def component_cache_path(name, locale = I18n.locale)
    "#{name}-#{locale}"
  end

  def expire_component_cache(name)
    I18n.available_locales.map do |locale|
      clear_cache(component_cache_path(name, locale))
    end
  end

  def expire_home_cache
    I18n.available_locales.map do |locale|
      clear_cache(component_cache_path('popular_articles', locale))
      clear_cache(component_cache_path('home_articles', locale))
    end
  end

  private

  def caching_enabled?
    ActionController::Base.perform_caching
  end

  def clear_cache(key, options = {})
    return unless caching_enabled?

    Rails.cache.delete(key, options)
  end

end
