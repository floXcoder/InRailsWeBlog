Rails.application.routes.draw do

  # Sidekiq interface
  mount Sidekiq::Web => '/sidekiq'

end
