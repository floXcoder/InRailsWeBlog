# Be sure to restart your server when you modify this file.

# Rails.application.config.session_store :cookie_store, key: '_InRailsWeBlog_session'

Rails.application.config.session_store :redis_session_store,
                                       {
                                           key: '_InRailsWeBlog_session',
                                           redis: {
                                               db: 0,
                                               expire_after: 120.minutes,
                                               key_prefix: 'inrailsweblog:session:',
                                               host: ENV['REDIS_HOST'],
                                               port: ENV['REDIS_PORT']
                                           },
                                           serializer: :hybrid # migrate from Marshal to JSON
                                       }
