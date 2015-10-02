# == Route Map
#
#      Prefix Verb URI Pattern Controller#Action
#        root GET  /           static_pages#home
# sidekiq_web      /sidekiq    Sidekiq::Web
#

require 'sidekiq/web'

Rails.application.routes.draw do

  # Root path
  root                  'static_pages#home'

  # Sidekiq interface
  mount Sidekiq::Web => '/sidekiq'

end
