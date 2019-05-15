# frozen_string_literal: true

require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
  # Root path
  root 'single_pages#home'

  # Routes managed by javascript router
  get '/users/*id',     to: 'single_pages#home'
  get '/search',        to: 'single_pages#home'
  get '/search/*id',    to: 'single_pages#home'
  get '/topics/*id',    to: 'single_pages#home'
  get '/tags',          to: 'single_pages#home'
  get '/tags/*ids',     to: 'single_pages#home'
  get '/tagged/*id',    to: 'single_pages#home'
  get '/articles/*id',  to: 'single_pages#home'

  # Concerns
  concern :tracker do |options|
    post    :clicked,   to: "#{options[:module]}#clicked"
    post    :viewed,    to: "#{options[:module]}#viewed"
  end

  concern :comments do |options|
    get     :comments,  to: "#{options[:module]}#comments"
    post    :comments,  to: "#{options[:module]}#add_comment"
    put     :comments,  to: "#{options[:module]}#update_comment"
    delete  :comments,  to: "#{options[:module]}#remove_comment"
  end

  concern :outdated do |options|
    resource :outdated, controller: 'outdated', only: [:create, :destroy], **options
  end

  concern :votes do |options|
    resource :votes, controller: 'votes', only: [:create, :destroy], **options
  end

  # API
  namespace :api, as: nil do
    namespace :v1, as: nil do
      # Users (devise)
      devise_scope :user do
        get     'signup', to: 'users/registrations#new',    as: :signup
        post    'signup', to: 'users/registrations#create'
        get     'login',  to: 'users/sessions#new',         as: :login
        post    'login',  to: 'users/sessions#create'
        delete  'logout', to: 'users/sessions#destroy',     as: :logout
      end

      devise_for :users, controllers: {
        registrations:      'users/registrations',
        sessions:           'users/sessions',
        passwords:          'users/passwords'
      }

      # Users
      resources :users, except: [:new, :create, :destroy] do
        collection do
          get :validation,         to: 'users#validation'

          concerns :tracker,       module: :users
        end

        member do
          get      :show,          to: 'users#show',               as: :root

          get      :profile,       to: 'users#profile',            as: :profile
          get      :comments,      to: 'users#comments',           as: :comments
          get      :recents,       to: 'users#recents',            as: :recents
          post     :recents,       to: 'users#update_recents'
          get      :activities,    to: 'users#activities',         as: :activities

          concerns :tracker,       module: :users
        end

        resources :bookmarks, controller: 'users/bookmarks', only: [:index, :create, :destroy]

        resources :settings, controller: 'users/settings', only: [:index] do
          collection do
            post :update,          to: 'users/settings#update'
          end
        end
      end

      # Users (activities)
      resources :activities, only: [:index]

      # Tags
      resources :tags, except: [:new, :create] do
        collection do
          put      :priority,  to: 'tags#update_priority'

          concerns :tracker,   module: :tags
        end

        member do
          concerns :tracker,   module: :tags

          concerns :comments,  module: :tags
        end
      end

      # Topics
      resources :topics do
        collection do
          get      :switch,   to: 'topics#switch'

          put      :priority, to: 'topics#update_priority'

          concerns :tracker,  module: :topics
        end

        member do
          concerns :tracker,  module: :tags
        end
      end

      # Articles
      resources :articles do
        collection do
          put      :priority,  to: 'articles#update_priority'

          concerns :tracker,   module: :articles
        end

        member do
          get      'shared/:public_link', to: 'articles#shared'

          get      :stories,   to: 'articles#stories'

          get      :history,   to: 'articles#history'
          get      :restore,   to: 'articles#restore'

          concerns :tracker,   module: :articles

          concerns :comments,  module: :articles
        end

        concerns :outdated,    module: :articles

        concerns :votes,       module: :articles
      end

      # shares
      resources :shares, only: [:index] do
        collection do
          post :topic,          to: 'shares#topic'
          post :article,        to: 'shares#article'
        end
      end

      # Search
      resources :search, only: [:index] do
        collection do
          get :autocomplete,   to: 'search#autocomplete'
        end
      end

      resources :comments, only: [:index]

      # Uploads data
      resources :uploads,  only: [:create, :update, :destroy]

    end
  end

  # SEO
  get '/robots.:format' => 'single_pages#robots'

  # Errors
  %w[404 422 500].each do |code|
    get code, to: 'errors#show', code: code
  end

  resources :errors, only: [:index, :show, :create, :destroy] do
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
  devise_for :admins, controllers: { sessions:  'users/sessions', passwords: 'users/passwords' }

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
