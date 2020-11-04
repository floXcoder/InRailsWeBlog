# frozen_string_literal: true

require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
  # Root path
  root 'pages#home'

  localized do
    ### Routes managed by javascript router (routes.jsx)
    # Base routes
    get '/', to: 'pages#home', as: :home, defaults: { name: 'home', public: true }

    # Search
    get '/search(/:query)', to: 'pages#home', as: :search, defaults: { name: 'search', public: true }

    # Users
    get '/users/:user_slug/topics', to: 'pages#user_home', as: :user_home, defaults: { name: 'user_home' }

    get '/users', to: 'pages#home', as: :users, defaults: { name: 'users', public: true }
    get '/users/password/new', to: 'pages#home', as: :new_password, defaults: { name: 'new_password', public: true }
    get '/users/password/edit', to: 'pages#home', as: :edit_password, defaults: { name: 'edit_password', public: true }
    get '/users/confirmation', to: 'pages#home', as: :user_confirm, defaults: { name: 'user_confirm', public: true }
    get '/users/:user_slug/show', to: 'pages#home', as: :show_user, defaults: { name: 'show_user', public: true }
    get '/users/:user_slug/edit', to: 'pages#home', as: :edit_user, defaults: { name: 'edit_user' }

    # Tags
    get '/tags', to: 'tags#index', as: :tags, defaults: { name: 'tags', public: true }
    get '/tags/:tag_slug', to: 'tags#show', as: :show_tag, defaults: { name: 'show_tag', public: true }
    get '/tags/:tag_slug/edit', to: 'tags#edit', as: :edit_tag, defaults: { name: 'edit_tag' }

    get '/users/:user_slug/topics/:topic_slug/tags', to: 'pages#home', as: :topic_tags, defaults: { name: 'topic_tags', public: true }
    get '/tags/:user_slug/sort', to: 'pages#home', as: :sort_tag, defaults: { name: 'sort_tag' }

    # Topics
    get '/users/:user_slug/topics/:topic_slug/show', to: 'topics#show', as: :user_topic, defaults: { name: 'user_topic', public: true }
    get '/users/:user_slug/topics/:topic_slug/edit', to: 'pages#home', as: :edit_topic, defaults: { name: 'edit_topic' }
    get '/users/:user_slug/topics/:topic_slug/edit-inventories', to: 'pages#home', as: :edit_inventories_topic, defaults: { name: 'edit_inventories_topic' }

    # Articles
    get '/users/:user_slug', to: 'articles#index', as: :user_articles, defaults: { name: 'user_articles', public: true }
    get '/users/:user_slug/topics/:topic_slug', to: 'articles#index', as: :topic_articles, defaults: { name: 'topic_articles', public: true }
    get '/tagged/:tag_slug(/:child_tag_slug)', to: 'articles#index', as: :tagged_articles, defaults: { name: 'tagged_articles', public: true }
    get '/users/:user_slug/articles/:article_slug', to: 'articles#show', as: :user_article, defaults: { name: 'user_article', public: true }
    get '/users/:user_slug/articles/:article_slug/edit', to: 'articles#edit', as: :edit_article, defaults: { name: 'edit_article' }

    get '/users/:user_slug/topics/:topic_slug/tagged/:tag_slug(/:child_tag_slug)', to: 'pages#home', as: :tagged_topic_articles, defaults: { name: 'tagged_topic_articles', public: true }
    get '/users/:user_slug/topics/:topic_slug/order/:order', to: 'pages#home', as: :order_topic_articles, defaults: { name: 'order_topic_articles' }
    get '/users/:user_slug/topics/:topic_slug/sort', to: 'pages#home', as: :sort_topic_articles, defaults: { name: 'sort_topic_articles' }
    get '/articles/shared/:article_slug/:public_link', to: 'pages#home', as: :shared_article, defaults: { name: 'shared_article' }
    get '/users/:user_slug/topics/:topic_slug/article-new', to: 'pages#home', as: :new_article, defaults: { name: 'new_article' }
    get '/users/:user_slug/articles/:article_slug/history', to: 'pages#home', as: :history_article, defaults: { name: 'history_article' }

    # Static routes
    get '/about', to: 'pages#about', as: :about, defaults: { name: 'about', public: true }
    get '/terms', to: 'pages#terms', as: :terms, defaults: { name: 'terms', public: true }
    get '/privacy', to: 'pages#privacy', as: :privacy, defaults: { name: 'privacy', public: true }

    # Other unnamed routes
    get '/search/*path', to: 'pages#home', defaults: { public: true }
    get '/tags/*path', to: 'pages#home', defaults: { public: true }
    get '/tagged/*path', to: 'pages#home', defaults: { public: true }
    get '/articles/*path', to: 'pages#home', defaults: { public: true }
    get '/users/*path', to: 'pages#home', defaults: { public: true }

    get '/404', to: 'pages#not_found', as: :not_found, defaults: { public: true }
  end

  get '/meta-tags', to: 'pages#meta_tag', as: :meta_tag

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

  # Redirect user connection to home
  get '/api/v1/users/sign_in', to: redirect('/', status: 301), constraints: { format: 'html' }

  # API
  namespace :api, as: nil do
    namespace :v1, as: nil do
      # Users (devise)
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
        confirmations:      'devise/confirmations',
        unlocks:            'devise/unlocks'
      }

      # Users
      resources :users, except: [:new, :create, :edit, :destroy] do
        collection do
          get :validation,         to: 'users#validation'
        end

        member do
          get      :show,          to: 'users#show'

          get      :comments,      to: 'users#comments'
          get      :recents,       to: 'users#recents'
          post     :recents,       to: 'users#update_recents'
          get      :activities,    to: 'users#activities'

          concerns :tracker,       module: :users
        end

        resources :bookmarks, controller: 'users/bookmarks', only: [:index, :create, :destroy]

        resources :settings, controller: 'users/settings', only: [:index] do
          collection do
            post :update,          to: 'users/settings#update'
          end
        end
      end

      # Users (activities)
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
      resources :topics, except: [:new] do
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

          post     'check-links',         to: 'articles#check_links'

          get      :recommendations,      to: 'articles#recommendations'

          get      :history,              to: 'articles#history'
          get      :restore,              to: 'articles#restore'

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

          post  :url_search,   to: 'search#url_search'

          post  :meta,         to: 'search#meta'
        end
      end

      resources :comments, only: [:index]

      # Uploads data (files, ...)
      resources :uploader, only: [:create, :update, :destroy]

      # Export user data
      resources :exporter, only: [:index]
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

    # Postgres requests analysis
    mount PgHero::Engine, at: '/admins/postgres'
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

    resources :seo, except: [:new, :edit] do
      collection do
        post :retrieve_parameters, to: 'seo#retrieve_parameters'
      end
    end

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

  # Open Search
  get '/opensearch.:format' => 'pages#open_search'

  # SEO
  get '/robots.:format' => 'pages#robots'

  # Health check
  health_check_routes

  # All other pages
  match '*path', to: 'pages#not_found', via: :all
end
