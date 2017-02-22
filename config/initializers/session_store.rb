# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :redis_session_store,
                                       {
                                           key: '_InRailsWeBlog_session',
                                           redis: {
                                               db:           0,
                                               expire_after: 240.minutes,
                                               host:         ENV['REDIS_HOST'],
                                               port:         ENV['REDIS_PORT'],
                                               key_prefix:   "_InRailsWeBlog_#{Rails.env}:session:"
                                           },
                                           serializer: :hybrid # migrate from Marshal to JSON
                                       }
