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
      get :validation,        to: 'users#validation'
    end

    member do
      get     :show,          to: 'users#show',               as: :root

      get     :draft,         to: 'users#draft',              as: :draft
      get     :bookmarks,     to: 'users#bookmarks',          as: :bookmarks
      get     :comments,      to: 'users#comments',           as: :comments
      get     :activities,    to: 'users#activities',         as: :activities

      post    :clicked,       to: 'users#clicked'
      post    :viewed,        to: 'users#viewed'
    end

    resources :topics,        controller: 'users/topics',   only: [:new, :update, :destroy] do
      member do
        get :switch,          to: 'users/topics#switch'
      end
    end

    resources :bookmarks,     controller: 'users/bookmarks',  only: [:create, :destroy]

    resources :settings,      controller: 'users/settings',   only: [:index, :update]
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

      get     :comments,  to: 'articles#comments'
      post    :comments,  to: 'articles#add_comment'
      put     :comments,  to: 'articles#update_comment'
      delete  :comments,  to: 'articles#remove_comment'

      post    :clicked,   to: 'articles#clicked'
      post    :viewed,    to: 'articles#viewed'
    end

    resources :votes,     controller: 'articles/votes' do
      collection do
        post    :up,      to: 'articles/votes#vote_up'
        post    :down,    to: 'articles/votes#vote_down'
      end
    end

    resources :outdated,  controller: 'articles/outdated', only: [:create, :destroy]
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

  # Routes managed by javascript router
  get '/article/*id',   to: 'static_pages#home'
  get '/tag/*id',       to: 'static_pages#home'
  get '/user/*id',      to: 'static_pages#home'

  # Errors
  %w( 404 422 500 ).each do |code|
    get code, to: 'errors#show', code: code
  end

  resources :errors, only: [ :index, :show, :create, :destroy ] do
    collection do
      post 'delete_all',     to: 'errors#destroy_all'
    end
  end

  # Admins
  devise_scope :admin do
    get     '/admin/login',  to: 'users/sessions#new',      as: :login_admin
    post    '/admin/login',  to: 'users/sessions#create'
    delete  '/admin/logout', to: 'users/sessions#destroy',  as: :logout_admin
  end
  devise_for :admins, controllers: {  sessions: 'users/sessions',
                                      passwords: 'users/passwords' }

  # Admin interface
  authenticate :admin do
    # Sidekiq interface
    mount Sidekiq::Web => '/admin/sidekiq'
  end

  # resources :admins
  get :admin,             to: 'admins#index'

  namespace :admin do
    # resources :managers, only: [] do
    #   collection do
    #     get     :pending_validation,        to: 'managers#pending_validation'
    #     get     :pending_comment_deletion,  to: 'managers#pending_comment_deletion'
    #
    #     get     :users,           to: 'managers#users'
    #     get     ':show_user/:user_id', to: 'managers#show_user'
    #
    #     get     :logs,            to: 'managers#logs'
    #
    #     get     :server,          to: 'managers#server'
    #
    #     get     :errors,          to: 'managers#errors'
    #   end
    # end
  end


end
