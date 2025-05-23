# frozen_string_literal: true

Rails.application.routes.draw do
  # Root path
  root 'pages#home'

  # Redirections (renamed articles)
  get '/fr/labels/conseils', to: redirect('/fr/labels/advice', status: 301)
  get '/fr/utilisateurs/flo/themes/intelligence-artificielle', to: redirect('/fr/utilisateurs/flo/themes/artificial-intelligence', status: 301)

  get '/users/flo/articles/gitlab-installation@serveur-debian', to: redirect('/fr/utilisateurs/flo/articles/gitlab-installation-automatique-et-manuel@debian-server', status: 301)
  get '/users/flo/articles/sentry@serveur-debian', to: redirect('/fr/utilisateurs/flo/articles/sentry-installation-and-configuration@debian-server', status: 301)
  get '/fr/utilisateurs/flo/articles/owncloud@serveur-debian', to: redirect('/fr/utilisateurs/flo/articles/owncloud-installation-et-configuration@debian-server', status: 301)
  get '/fr/utilisateurs/flo/articles/rails-installation-complete-sur-un-serveur@serveur-debian', to: redirect('/fr/utilisateurs/flo/articles/rails-installation-complete-sur-un-serveur@debian-server', status: 301)
  get '/users/flo/articles/matomo-piwik-installation-et-configuration@serveur-debian', to: redirect('/fr/utilisateurs/flo/articles/matomo-piwik-installation-et-configuration@debian-server', status: 301)
  get '/fr/utilisateurs/flo/articles/alias-indispensables-pour-linux@serveur-debian', to: redirect('/fr/utilisateurs/flo/articles/alias-indispensables-pour-linux@debian-server', status: 301)
  get '/fr/utilisateurs/flo/articles/securisation-du-serveur@serveur-debian', to: redirect('/fr/utilisateurs/flo/articles/outils-pour-securiser-un-serveur-debian@debian-server', status: 301)
  get '/fr/utilisateurs/flo/articles/ssh-configuration@serveur-debian', to: redirect('/fr/utilisateurs/flo/articles/ssh-configuration@debian-server', status: 301)
  get '/fr/utilisateurs/flo/articles/ssl-installation-des-certificats-sur-linux@serveur-debian', to: redirect('/fr/utilisateurs/flo/articles/ssl-installation-des-certificats-sur-linux@debian-server', status: 301)
  get '/fr/utilisateurs/flo/articles/initialisation-du-serveur@serveur-debian', to: redirect('/fr/utilisateurs/flo/articles/initialisation-du-serveur@debian-server', status: 301)
  get '/fr/utilisateurs/flo/articles/redis-installation@serveur-debian', to: redirect('/fr/utilisateurs/flo/articles/redis-installation@debian-server', status: 301)
  get '/fr/utilisateurs/flo/articles/resume-de-python@intelligence-artificielle', to: redirect('/fr/utilisateurs/flo/articles/resume-de-python@artificial-intelligence', status: 301)
  get '/fr/utilisateurs/flo/articles/machine-learning-choix-des-modeles-et-donnees@intelligence-artificielle', to: redirect('/fr/utilisateurs/flo/articles/machine-learning-choix-des-modeles-et-donnees@artificial-intelligence', status: 301)
  get '/fr/utilisateurs/flo/articles/environnement-de-travail-pycharm-et-anaconda@intelligence-artificielle', to: redirect('/fr/utilisateurs/flo/articles/environnement-de-travail-pycharm-et-anaconda@artificial-intelligence', status: 301)
  get '/fr/utilisateurs/flo/articles/panda-evolution-de-numpy@intelligence-artificielle', to: redirect('/fr/utilisateurs/flo/articles/decouverte-de-numpy@artificial-intelligence', status: 301)
  get '/fr/utilisateurs/flo/articles/scikit-learn-premiere-approche-du-machine-learning@intelligence-artificielle', to: redirect('/fr/utilisateurs/flo/articles/scikit-learn-premiere-approche-du-machine-learning@artificial-intelligence', status: 301)
  get '/fr/utilisateurs/flo/articles/matplotlib-et-seaborn-visualisation-des-donnees@intelligence-artificielle', to: redirect('/fr/utilisateurs/flo/articles/matplotlib-et-seaborn-visualisation-des-donnees@artificial-intelligence', status: 301)

  get '/fr/utilisateurs/flo/articles/dokuwiki-customisation@serveur-debian', to: redirect('/', status: 301)

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
    get '/users/:user_slug', to: 'pages#home', as: :show_user, defaults: { name: 'show_user', public: true }
    get '/users/:user_slug/edit', to: 'pages#home', as: :edit_user, defaults: { name: 'edit_user' }

    # Tags
    get '/tags', to: 'tags#index', as: :tags, defaults: { name: 'tags', public: true }
    get '/tags/:tag_slug', to: 'tags#show', as: :show_tag, defaults: { name: 'show_tag', public: true }
    get '/tags/:tag_slug/edit', to: 'tags#edit', as: :edit_tag, defaults: { name: 'edit_tag' }

    get '/users/:user_slug/topics/:topic_slug/tags', to: 'tags#index', as: :topic_tags, defaults: { name: 'topic_tags', public: true }
    get '/tags/:user_slug/sort', to: 'pages#home', as: :sort_tag, defaults: { name: 'sort_tag' }

    # Topics
    get '/users/:user_slug/topics/:topic_slug/show', to: 'topics#show', as: :user_topic, defaults: { name: 'user_topic', public: true }
    get '/users/:user_slug/topics/:topic_slug/edit', to: 'pages#home', as: :edit_topic, defaults: { name: 'edit_topic' }
    get '/users/:user_slug/topics/:topic_slug/edit-inventories', to: 'pages#home', as: :edit_inventories_topic, defaults: { name: 'edit_inventories_topic' }

    # Articles
    get '/users/:user_slug', to: 'articles#index', as: :user_articles, defaults: { name: 'user_articles', public: true }
    get '/users/:user_slug/topics/:topic_slug', to: 'articles#index', as: :topic_articles, defaults: { name: 'topic_articles', public: true }
    get '/tagged/:tag_slug(/:child_tag_slug)', to: 'articles#index', as: :tagged_articles, defaults: { name: 'tagged_articles', public: true }
    get '/users/:user_slug/topics/:topic_slug/tagged/:tag_slug(/:child_tag_slug)', to: 'articles#index', as: :tagged_topic_articles, defaults: { name: 'tagged_topic_articles', public: true }
    get '/users/:user_slug/articles/:article_slug', to: 'articles#show', as: :user_article, defaults: { name: 'user_article', public: true }
    get '/users/:user_slug/articles/:article_slug/edit', to: 'articles#edit', as: :edit_article, defaults: { name: 'edit_article' }

    get '/users/:user_slug/topics/:topic_slug/order/:order', to: 'pages#home', as: :order_topic_articles, defaults: { name: 'order_topic_articles' }
    get '/users/:user_slug/topics/:topic_slug/:tag_slug/order/:order', to: 'pages#home', as: :order_tagged_topic_articles, defaults: { name: 'order_tagged_topic_articles' }
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
  get '/feed', to: 'pages#feed', as: :feed

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

  concern :archived do |options|
    resource :archived, controller: 'archived', only: [:create, :destroy], **options
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

          get :recents,            to: 'users#recents'
        end

        member do
          get      :show,          to: 'users#show'

          get      :comments,      to: 'users#comments'
          get      :recents,       to: 'users#recents'

          concerns :tracker,       module: :users
        end

        resources :bookmarks, controller: 'users/bookmarks', only: [:index, :create, :destroy]

        resources :settings, controller: 'users/settings', only: [:index] do
          collection do
            post :update,          to: 'users/settings#update'
          end
        end
      end

      # Tracking
      resources :tracker, only: [:index] do
        collection do
          post :action, to: 'tracker#action'
        end
      end

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

          get      :tracking,             to: 'articles#tracking'

          get      :history,              to: 'articles#history'
          get      :restore,              to: 'articles#restore'

          concerns :tracker,   module: :articles

          concerns :comments,  module: :articles
        end

        concerns :outdated,    module: :articles

        concerns :archived,    module: :articles

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
    # Jobs interface
    mount GoodJob::Engine, at: '/admins/jobs'

    # Postgres requests analysis
    mount PgHero::Engine, at: '/admins/postgres' if Rails.env.production?
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
    resources :visits, only: [:index]

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
        post :flush_cache, to: 'caches#flush_cache'
      end
    end
  end

  # PWA
  get '/manifest.:format' => 'pages#manifest'
  get '/.well-known/assetlinks.:format' => 'pages#assetlinks'
  get '/.well-known/traffic-advice' => 'pages#traffic_advice'

  # Open Search
  get '/opensearch.:format' => 'pages#open_search'

  # SEO
  get '/robots.:format' => 'pages#robots'
  get '/sitemap.xml' => 'pages#sitemap'
  get '/sitemap.xml.gz' => 'pages#sitemap'

  # Health check
  health_check_routes if Rails.env.production?

  # All other pages
  match '*path', to: 'pages#not_found', via: :all
end
