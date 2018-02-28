# Be sure to restart your server when you modify this file.

InRailsWeBlog::Application.config.session_store :redis_session_store,
                                                key:        "_#{ENV['WEBSITE_NAME']}_session",
                                                redis:      {
                                                  # db:           0,
                                                  expire_after: 4.days,
                                                  host:         ENV['REDIS_HOST'],
                                                  port:         ENV['REDIS_PORT'],
                                                  key_prefix:   "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:session:"
                                                },
                                                serializer: :hybrid # migrate from Marshal to JSON
