# frozen_string_literal: true

require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
  # Root path
  root 'pages#home'

  # Routes managed by javascript router
  get '/search',                                      to: 'pages#home'
  get '/search/*path',                                to: 'pages#home'

  get '/users/password/new',                          to: 'pages#home', as: :new_password
  get '/users/password/edit',                         to: 'pages#home', as: :edit_password
  get '/users/:user_slug',                            to: 'pages#home', as: :show_user
  get '/users/*path',                                 to: 'pages#home'
  get '/users/:user_slug/topics/:topic_slug/show',    to: 'pages#home', as: :show_topic
  get '/users/:user_slug/articles/:article_slug',     to: 'pages#home', as: :show_article

  get '/topics/*path',                                to: 'pages#home'

  get '/tags',                                        to: 'pages#home'
  get '/tags/:tag_slug',                              to: 'pages#home', as: :show_tag
  get '/tags/*path',                                  to: 'pages#home'
  get '/tagged/*path',                                to: 'pages#home'

  get '/articles/shared/:article_slug/:public_link',  to: 'pages#home', as: :show_shared_article
  get '/articles/*path',                              to: 'pages#home'

  get '/404',                                         to: 'pages#home'

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
        get     'signup',   to: 'users/registrations#new',    as: :signup
        post    'signup',   to: 'users/registrations#create'
        get     'login',    to: 'users/sessions#new',         as: :login
        post    'login',    to: 'users/sessions#create'
        delete  'logout',   to: 'users/sessions#destroy',     as: :logout
      end

      devise_for :users, controllers: {
        registrations:      'api/v1/users/registrations',
        sessions:           'api/v1/users/sessions',
        passwords:          'api/v1/users/passwords',
        confirmations:      'api/v1/users/confirmations',
        unlocks:            'api/v1/users/unlocks'
      }

      # Users
      resources :users, except: [:new, :create, :edit, :destroy] do
        collection do
          get :validation,         to: 'users#validation'
        end

        member do
          get      :show,          to: 'users#show',               as: :root

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
        end

        member do
          concerns :tracker,   module: :tags

          concerns :comments,  module: :tags
        end
      end

      # Topics
      resources :topics, except: [:new, :edit] do
        collection do
          get      :switch,   to: 'topics#switch'

          put      :priority, to: 'topics#update_priority'
        end

        member do
          concerns :tracker,  module: :topics
        end

        resources :inventory_fields, controller: 'topics/inventory_fields', only: [:create]
      end

      # Articles
      resources :articles, except: [:new] do
        collection do
          put      :priority,  to: 'articles#update_priority'
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
          get   :autocomplete, to: 'search#autocomplete'

          post  :meta,         to: 'search#meta'
        end
      end

      resources :comments, only: [:index]

      # Uploads data
      resources :uploads,  only: [:create, :update, :destroy]
    end
  end

  # Admins
  devise_scope :admin do
    get     '/admins/login',  to: 'admins/sessions#new',      as: :login_admin
    post    '/admins/login',  to: 'admins/sessions#create'
    delete  '/admins/logout', to: 'admins/sessions#destroy',  as: :logout_admin
  end
  devise_for :admins, controllers: { sessions: 'admins/sessions' }

  # Admin interface
  authenticate :admin do
    # Sidekiq interface
    mount Sidekiq::Web => '/admins/sidekiq'
  end

  # resources :admins
  resources :admins, only: [:index] do
    collection do
      get   :users,       to: 'admins#users'

      get   :comments,    to: 'admins#comments'

      get   :topics,      to: 'admins#topics'

      get   :tags,        to: 'admins#tags'

      get   :articles,    to: 'admins#articles'
    end
  end

  namespace :admins do
    resources :blogs, except: [:new, :edit]

    resources :logs, only: [:index] do
      collection do
        post :stream,     to: 'logs#stream'
      end
    end

    resources :caches, only: [:index] do
      collection do
        post  :flush_cache, to: 'caches#flush_cache'
      end
    end
  end

  # SEO
  get '/robots.:format' => 'pages#robots'

  match '*path' => redirect('/404'), via: :all
end
