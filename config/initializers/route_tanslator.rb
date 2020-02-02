# frozen_string_literal: true

RouteTranslator.config do |config|
  config.available_locales = I18n.available_locales
  config.force_locale = true
  config.generate_unnamed_unlocalized_routes = true
  config.locale_param_key = :locale
end
