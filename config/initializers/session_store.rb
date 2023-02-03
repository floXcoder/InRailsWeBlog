# frozen_string_literal: true

InRailsWeBlog::Application.config.session_store :redis_session_store,
                                                key:        "_#{ENV['WEBSITE_NAME']}_session",
                                                redis:      {
                                                  db:           ENV['REDIS_DB'].to_i,
                                                  expire_after: InRailsWeBlog.settings.session_duration,
                                                  host:         ENV['REDIS_HOST'],
                                                  port:         ENV['REDIS_PORT'],
                                                  key_prefix:   "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:session:"
                                                },
                                                serializer: :hybrid # migrate from Marshal to JSON
