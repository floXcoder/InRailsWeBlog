require 'sidekiq/web'
require 'sidekiq/cron/web'

InRailsWeBlog::Application.routes.draw do
  # Root path
  root  'static_pages#home'

  # Users (devise)
  devise_scope :user do
    get     'signup', to: 'users/registrations#new',    as: :signup
    post    'signup', to: 'users/registrations#create'
    get     'login',  to: 'users/sessions#new',         as: :login
    post    'login',  to: 'users/sessions#create'
    delete  'logout', to: 'users/sessions#destroy',     as: :logout
  end
  devise_for :users, controllers: { registrations:  'users/registrations',
                                    sessions:       'users/sessions',
                                    passwords:      'users/passwords' }

  # Users
  resources :users, except: [:new, :create, :destroy] do
    collection do
      get :validation,      to: 'users#validation'
    end

    member do
      get     :show,          to: 'users#show',               as: :root
      get     :preferences,   to: 'users#preferences',        as: :preferences
      post    :preferences,   to: 'users#update_preferences'

      post    :topic,         to: 'users#add_topic'
      post    :change_topic,  to: 'users#change_topic'
      put     :topic,         to: 'users#update_topic'
      delete  :topic,         to: 'users#remove_topic'

      get     :temporary,     to: 'users#temporary',          as: :temporary
      get     :bookmarks,     to: 'users#bookmarks',          as: :bookmarks
      get     :comments,      to: 'users#comments',           as: :comments
      get     :activities,    to: 'users#activities',         as: :activities

      post    :clicked,       to: 'users#clicked'
      post    :viewed,        to: 'users#viewed'
    end
  end

  # Users (activities)
  resources :activities, only: [:index]

  # Articles
  resources :articles do
    member do
      get     :history,   to: 'articles#historarticlesy'
      get     :restore,   to: 'articles#restore'
      post    :bookmark,  to: 'articles#add_bookmark'
      delete  :bookmark,  to: 'articles#remove_bookmark'
      post    :outdate,   to: 'articles#add_outdated'
      delete  :outdate,   to: 'articles#remove_outdated'
      post    :vote_up,   to: 'articles#vote_up'
      post    :vote_down, to: 'articles#vote_down'

      get     :comments,  to: 'articles#comments'
      post    :comments,  to: 'articles#add_comment'
      put     :comments,  to: 'articles#update_comment'
      delete  :comments,  to: 'articles#remove_comment'

      post    :clicked,   to: 'articles#clicked'
      post    :viewed,    to: 'articles#viewed'
    end
  end

  # Tags
  resources :tags do
    member do
      post    :clicked,   to: 'tags#clicked'
      post    :viewed,    to: 'tags#viewed'
    end
  end

  # Global search
  resources :search, only: [ :index ] do
    collection do
      get   :autocomplete,   to: 'search#autocomplete'
    end
  end

  resources :comments, only: [ :index ]

  # Static pages
  get   :terms_of_use,  to: 'static_pages#terms_of_use'

  # Errors
  %w( 404 422 500 ).each do |code|
    get code, to: 'errors#show', code: code
  end

  resources :errors, only: [ :index, :show, :create, :destroy ] do
    collection do
      post 'delete_all',     to: 'errors#destroy_all'
    end
  end

  # Sidekiq interface
  authenticate :user, lambda { |user| user.admin? } do
    mount Sidekiq::Web => '/admin/sidekiq'
  end

  # Admin
  get :admin,     to: 'admin#index'

  namespace :admin do
    get       :errors,    to: 'errors_manager#index'
    resources :users_manager
  end

  # Routes managed by javascript router
  get '/article/*id',   to: 'static_pages#home'
  get '/tag/*id',       to: 'static_pages#home'
  get '/user/*id',      to: 'static_pages#home'
end
