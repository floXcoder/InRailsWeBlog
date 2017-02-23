# == Route Map
#
#                    Prefix Verb   URI Pattern                             Controller#Action
#                      root GET    /                                       static_pages#home
#                    signup GET    /signup(.:format)                       users/registrations#new
#                           POST   /signup(.:format)                       users/registrations#create
#                     login GET    /login(.:format)                        users/sessions#new
#                           POST   /login(.:format)                        users/sessions#create
#                    logout DELETE /logout(.:format)                       users/sessions#destroy
#          new_user_session GET    /users/sign_in(.:format)                users/sessions#new
#              user_session POST   /users/sign_in(.:format)                users/sessions#create
#      destroy_user_session DELETE /users/sign_out(.:format)               users/sessions#destroy
#             user_password POST   /users/password(.:format)               users/passwords#create
#         new_user_password GET    /users/password/new(.:format)           users/passwords#new
#        edit_user_password GET    /users/password/edit(.:format)          users/passwords#edit
#                           PATCH  /users/password(.:format)               users/passwords#update
#                           PUT    /users/password(.:format)               users/passwords#update
#  cancel_user_registration GET    /users/cancel(.:format)                 users/registrations#cancel
#         user_registration POST   /users(.:format)                        users/registrations#create
#     new_user_registration GET    /users/sign_up(.:format)                users/registrations#new
#    edit_user_registration GET    /users/edit(.:format)                   users/registrations#edit
#                           PATCH  /users(.:format)                        users/registrations#update
#                           PUT    /users(.:format)                        users/registrations#update
#                           DELETE /users(.:format)                        users/registrations#destroy
#         user_confirmation POST   /users/confirmation(.:format)           devise/confirmations#create
#     new_user_confirmation GET    /users/confirmation/new(.:format)       devise/confirmations#new
#                           GET    /users/confirmation(.:format)           devise/confirmations#show
#               user_unlock POST   /users/unlock(.:format)                 devise/unlocks#create
#           new_user_unlock GET    /users/unlock/new(.:format)             devise/unlocks#new
#                           GET    /users/unlock(.:format)                 devise/unlocks#show
#          validation_users GET    /users/validation(.:format)             users#validation
#                 root_user GET    /users/:id(.:format)                    users#show
#          preferences_user GET    /users/:id/preferences(.:format)        users#preferences
#                           POST   /users/:id/preferences(.:format)        users#update_preferences
#                topic_user POST   /users/:id/topic(.:format)              users#add_topic
#         change_topic_user POST   /users/:id/change_topic(.:format)       users#change_topic
#                           PUT    /users/:id/topic(.:format)              users#update_topic
#                           DELETE /users/:id/topic(.:format)              users#remove_topic
#            temporary_user GET    /users/:id/temporary(.:format)          users#temporary
#            bookmarks_user GET    /users/:id/bookmarks(.:format)          users#bookmarks
#             comments_user GET    /users/:id/comments(.:format)           users#comments
#           activities_user GET    /users/:id/activities(.:format)         users#activities
#              clicked_user POST   /users/:id/clicked(.:format)            users#clicked
#               viewed_user POST   /users/:id/viewed(.:format)             users#viewed
#                     users GET    /users(.:format)                        users#index
#                 edit_user GET    /users/:id/edit(.:format)               users#edit
#                      user GET    /users/:id(.:format)                    users#show
#                           PATCH  /users/:id(.:format)                    users#update
#                           PUT    /users/:id(.:format)                    users#update
#                activities GET    /activities(.:format)                   activities#index
#           history_article GET    /articles/:id/history(.:format)         articles#history
#           restore_article GET    /articles/:id/restore(.:format)         articles#restore
#          bookmark_article POST   /articles/:id/bookmark(.:format)        articles#add_bookmark
#                           DELETE /articles/:id/bookmark(.:format)        articles#remove_bookmark
#           outdate_article POST   /articles/:id/outdate(.:format)         articles#add_outdated
#                           DELETE /articles/:id/outdate(.:format)         articles#remove_outdated
#           vote_up_article POST   /articles/:id/vote_up(.:format)         articles#vote_up
#         vote_down_article POST   /articles/:id/vote_down(.:format)       articles#vote_down
#          comments_article GET    /articles/:id/comments(.:format)        articles#comments
#                           POST   /articles/:id/comments(.:format)        articles#add_comment
#                           PUT    /articles/:id/comments(.:format)        articles#update_comment
#                           DELETE /articles/:id/comments(.:format)        articles#remove_comment
#           clicked_article POST   /articles/:id/clicked(.:format)         articles#clicked
#            viewed_article POST   /articles/:id/viewed(.:format)          articles#viewed
#                  articles GET    /articles(.:format)                     articles#index
#                           POST   /articles(.:format)                     articles#create
#               new_article GET    /articles/new(.:format)                 articles#new
#              edit_article GET    /articles/:id/edit(.:format)            articles#edit
#                   article GET    /articles/:id(.:format)                 articles#show
#                           PATCH  /articles/:id(.:format)                 articles#update
#                           PUT    /articles/:id(.:format)                 articles#update
#                           DELETE /articles/:id(.:format)                 articles#destroy
#               clicked_tag POST   /tags/:id/clicked(.:format)             tags#clicked
#                viewed_tag POST   /tags/:id/viewed(.:format)              tags#viewed
#                      tags GET    /tags(.:format)                         tags#index
#                           POST   /tags(.:format)                         tags#create
#                   new_tag GET    /tags/new(.:format)                     tags#new
#                  edit_tag GET    /tags/:id/edit(.:format)                tags#edit
#                       tag GET    /tags/:id(.:format)                     tags#show
#                           PATCH  /tags/:id(.:format)                     tags#update
#                           PUT    /tags/:id(.:format)                     tags#update
#                           DELETE /tags/:id(.:format)                     tags#destroy
# autocomplete_search_index GET    /search/autocomplete(.:format)          search#autocomplete
#              search_index GET    /search(.:format)                       search#index
#                  comments GET    /comments(.:format)                     comments#index
#              terms_of_use GET    /terms_of_use(.:format)                 static_pages#terms_of_use
#         delete_all_errors POST   /errors/delete_all(.:format)            errors#destroy_all
#                    errors GET    /errors(.:format)                       errors#index
#                           POST   /errors(.:format)                       errors#create
#                     error DELETE /errors/:id(.:format)                   errors#destroy
#               sidekiq_web        /admin/sidekiq                          Sidekiq::Web
#                     admin GET    /admin(.:format)                        admin#index
#              admin_errors GET    /admin/errors(.:format)                 admin/errors_manager#index
# admin_users_manager_index GET    /admin/users_manager(.:format)          admin/users_manager#index
#                           POST   /admin/users_manager(.:format)          admin/users_manager#create
#   new_admin_users_manager GET    /admin/users_manager/new(.:format)      admin/users_manager#new
#  edit_admin_users_manager GET    /admin/users_manager/:id/edit(.:format) admin/users_manager#edit
#       admin_users_manager GET    /admin/users_manager/:id(.:format)      admin/users_manager#show
#                           PATCH  /admin/users_manager/:id(.:format)      admin/users_manager#update
#                           PUT    /admin/users_manager/:id(.:format)      admin/users_manager#update
#                           DELETE /admin/users_manager/:id(.:format)      admin/users_manager#destroy
#                           GET    /article/*id(.:format)                  static_pages#home
#                           GET    /tag/*id(.:format)                      static_pages#home
#                           GET    /user/*id(.:format)                     static_pages#home
#

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
  resources :errors, only: [ :index, :create, :destroy ] do
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
