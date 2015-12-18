# == Route Map
#
#                   Prefix Verb   URI Pattern                       Controller#Action
#                     root GET    /                                 static_pages#home
#                   signup GET    /signup(.:format)                 users/registrations#new
#                          POST   /signup(.:format)                 users/registrations#create
#                    login GET    /login(.:format)                  users/sessions#new
#                          POST   /login(.:format)                  users/sessions#create
#                   logout DELETE /logout(.:format)                 users/sessions#destroy
#         new_user_session GET    /users/sign_in(.:format)          users/sessions#new
#             user_session POST   /users/sign_in(.:format)          users/sessions#create
#     destroy_user_session DELETE /users/sign_out(.:format)         users/sessions#destroy
#            user_password POST   /users/password(.:format)         users/passwords#create
#        new_user_password GET    /users/password/new(.:format)     users/passwords#new
#       edit_user_password GET    /users/password/edit(.:format)    users/passwords#edit
#                          PATCH  /users/password(.:format)         users/passwords#update
#                          PUT    /users/password(.:format)         users/passwords#update
# cancel_user_registration GET    /users/cancel(.:format)           users/registrations#cancel
#        user_registration POST   /users(.:format)                  users/registrations#create
#    new_user_registration GET    /users/sign_up(.:format)          users/registrations#new
#   edit_user_registration GET    /users/edit(.:format)             users/registrations#edit
#                          PATCH  /users(.:format)                  users/registrations#update
#                          PUT    /users(.:format)                  users/registrations#update
#                          DELETE /users(.:format)                  users/registrations#destroy
#        user_confirmation POST   /users/confirmation(.:format)     devise/confirmations#create
#    new_user_confirmation GET    /users/confirmation/new(.:format) devise/confirmations#new
#                          GET    /users/confirmation(.:format)     devise/confirmations#show
#              user_unlock POST   /users/unlock(.:format)           devise/unlocks#create
#          new_user_unlock GET    /users/unlock/new(.:format)       devise/unlocks#new
#                          GET    /users/unlock(.:format)           devise/unlocks#show
#         validation_users GET    /users/validation(.:format)       users#validation
#                root_user GET    /users/:id(.:format)              users#show
#         preferences_user GET    /users/:id/preferences(.:format)  users#preferences
#  update_preferences_user POST   /users/:id/preferences(.:format)  users#update_preferences
#           temporary_user GET    /users/:id/temporary(.:format)    users#temporary
#           bookmarks_user GET    /users/:id/bookmarks(.:format)    users#bookmarks
#             clicked_user POST   /users/:id/clicked(.:format)      users#clicked
#              viewed_user POST   /users/:id/viewed(.:format)       users#viewed
#                    users GET    /users(.:format)                  users#index
#                          POST   /users(.:format)                  users#create
#                 new_user GET    /users/new(.:format)              users#new
#                edit_user GET    /users/:id/edit(.:format)         users#edit
#                     user GET    /users/:id(.:format)              users#show
#                          PATCH  /users/:id(.:format)              users#update
#                          PUT    /users/:id(.:format)              users#update
#                          DELETE /users/:id(.:format)              users#destroy
#          search_articles GET    /articles/search(.:format)        articles#search
#    autocomplete_articles GET    /articles/autocomplete(.:format)  articles#autocomplete
#          history_article GET    /articles/:id/history(.:format)   articles#history
#          restore_article GET    /articles/:id/restore(.:format)   articles#restore
#         bookmark_article POST   /articles/:id/bookmark(.:format)  articles#add_bookmark
#                          DELETE /articles/:id/bookmark(.:format)  articles#remove_bookmark
#         comments_article GET    /articles/:id/comments(.:format)  articles#comments
#                          POST   /articles/:id/comments(.:format)  articles#add_comment
#                          PUT    /articles/:id/comments(.:format)  articles#update_comment
#                          DELETE /articles/:id/comments(.:format)  articles#remove_comment
#          clicked_article POST   /articles/:id/clicked(.:format)   articles#clicked
#           viewed_article POST   /articles/:id/viewed(.:format)    articles#viewed
#                 articles GET    /articles(.:format)               articles#index
#                          POST   /articles(.:format)               articles#create
#              new_article GET    /articles/new(.:format)           articles#new
#             edit_article GET    /articles/:id/edit(.:format)      articles#edit
#                  article GET    /articles/:id(.:format)           articles#show
#                          PATCH  /articles/:id(.:format)           articles#update
#                          PUT    /articles/:id(.:format)           articles#update
#                          DELETE /articles/:id(.:format)           articles#destroy
#              clicked_tag POST   /tags/:id/clicked(.:format)       tags#clicked
#               viewed_tag POST   /tags/:id/viewed(.:format)        tags#viewed
#                     tags GET    /tags(.:format)                   tags#index
#                          POST   /tags(.:format)                   tags#create
#                  new_tag GET    /tags/new(.:format)               tags#new
#                 edit_tag GET    /tags/:id/edit(.:format)          tags#edit
#                      tag GET    /tags/:id(.:format)               tags#show
#                          PATCH  /tags/:id(.:format)               tags#update
#                          PUT    /tags/:id(.:format)               tags#update
#                          DELETE /tags/:id(.:format)               tags#destroy
#                    admin GET    /admin(.:format)                  admins#show
#             terms_of_use GET    /terms_of_use(.:format)           static_pages#terms_of_use
#              sidekiq_web        /sidekiq                          Sidekiq::Web
#                   errors GET    /errors(.:format)                 errors#index
#                          POST   /errors(.:format)                 errors#create
#                new_error GET    /errors/new(.:format)             errors#new
#               edit_error GET    /errors/:id/edit(.:format)        errors#edit
#                    error GET    /errors/:id(.:format)             errors#show
#                          PATCH  /errors/:id(.:format)             errors#update
#                          PUT    /errors/:id(.:format)             errors#update
#                          DELETE /errors/:id(.:format)             errors#destroy
#                          GET    /404(.:format)                    errors#error {:code=>"404"}
#                          GET    /422(.:format)                    errors#error {:code=>"422"}
#                          GET    /500(.:format)                    errors#error {:code=>"500"}
#

require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
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
  resources :users do
    collection do
      get :validation,      to: 'users#validation'
    end

    member do
      get   :show,          to: 'users#show',               as: :root
      get   :preferences,   to: 'users#preferences',        as: :preferences
      post  :preferences,   to: 'users#update_preferences', as: :update_preferences
      get   :temporary,     to: 'users#temporary',          as: :temporary
      get   :bookmarks,     to: 'users#bookmarks',          as: :bookmarks

      post    :clicked,     to: 'users#clicked'
      post    :viewed,      to: 'users#viewed'
    end
  end

  # Articles
  resources :articles do
    collection do
      get   :search,        to: 'articles#search'
      get   :autocomplete,  to: 'articles#autocomplete'
    end

    member do
      get     :history,   to: 'articles#history'
      get     :restore,   to: 'articles#restore'
      post    :bookmark,  to: 'articles#add_bookmark'
      delete  :bookmark,  to: 'articles#remove_bookmark'

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

  # Admin
  get :admin, to: 'admins#show'

  # Static pages
  get   :terms_of_use,  to: 'static_pages#terms_of_use'

  # Sidekiq interface
  mount Sidekiq::Web => '/sidekiq'

  # Errors
  resources :errors do
  end
end
