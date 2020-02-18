# frozen_string_literal: true

RouteTranslator.config do |config|
  config.available_locales                   = I18n.available_locales
  config.force_locale                        = false
  config.generate_unnamed_unlocalized_routes = false
  config.locale_param_key                    = :locale
end
