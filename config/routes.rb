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
#         validation_users GET    /users/validation(.:format)       users#validation {:has_many=>:comments}
#                root_user GET    /users/:id(.:format)              users#show {:has_many=>:comments}
#          preference_user GET    /users/:id/preference(.:format)   users#preference {:has_many=>:comments}
#   update_preference_user POST   /users/:id/preference(.:format)   users#update_preference {:has_many=>:comments}
#           temporary_user GET    /users/:id/temporary(.:format)    users#temporary {:has_many=>:comments}
#            bookmark_user GET    /users/:id/bookmark(.:format)     users#bookmark {:has_many=>:comments}
#                    users GET    /users(.:format)                  users#index {:has_many=>:comments}
#                          POST   /users(.:format)                  users#create {:has_many=>:comments}
#                 new_user GET    /users/new(.:format)              users#new {:has_many=>:comments}
#                edit_user GET    /users/:id/edit(.:format)         users#edit {:has_many=>:comments}
#                     user GET    /users/:id(.:format)              users#show {:has_many=>:comments}
#                          PATCH  /users/:id(.:format)              users#update {:has_many=>:comments}
#                          PUT    /users/:id(.:format)              users#update {:has_many=>:comments}
#                          DELETE /users/:id(.:format)              users#destroy {:has_many=>:comments}
#          search_articles GET    /articles/search(.:format)        articles#search {:has_many=>:comments}
#    autocomplete_articles GET    /articles/autocomplete(.:format)  articles#autocomplete {:has_many=>:comments}
#          history_article GET    /articles/:id/history(.:format)   articles#history {:has_many=>:comments}
#          restore_article GET    /articles/:id/restore(.:format)   articles#restore {:has_many=>:comments}
#         bookmark_article POST   /articles/:id/bookmark(.:format)  articles#bookmark {:has_many=>:comments}
#                 articles GET    /articles(.:format)               articles#index {:has_many=>:comments}
#                          POST   /articles(.:format)               articles#create {:has_many=>:comments}
#              new_article GET    /articles/new(.:format)           articles#new {:has_many=>:comments}
#             edit_article GET    /articles/:id/edit(.:format)      articles#edit {:has_many=>:comments}
#                  article GET    /articles/:id(.:format)           articles#show {:has_many=>:comments}
#                          PATCH  /articles/:id(.:format)           articles#update {:has_many=>:comments}
#                          PUT    /articles/:id(.:format)           articles#update {:has_many=>:comments}
#                          DELETE /articles/:id(.:format)           articles#destroy {:has_many=>:comments}
#                     tags GET    /tags(.:format)                   tags#index
#                          POST   /tags(.:format)                   tags#create
#                  new_tag GET    /tags/new(.:format)               tags#new
#                 edit_tag GET    /tags/:id/edit(.:format)          tags#edit
#                      tag GET    /tags/:id(.:format)               tags#show
#                          PATCH  /tags/:id(.:format)               tags#update
#                          PUT    /tags/:id(.:format)               tags#update
#                          DELETE /tags/:id(.:format)               tags#destroy
#             terms_of_use GET    /terms_of_use(.:format)           static_pages#terms_of_use
#              sidekiq_web        /sidekiq                          Sidekiq::Web
#

require 'sidekiq/web'

Rails.application.routes.draw do

  # Root path
  root  'static_pages#home'

  # User with devise
  devise_scope :user do
    get     'signup', to: 'users/registrations#new',    as: :signup
    post    'signup', to: 'users/registrations#create'
    get     'login',  to: 'users/sessions#new',         as: :login
    post    'login',  to: 'users/sessions#create'
    delete  'logout', to: 'users/sessions#destroy',     as: :logout
  end
  devise_for :users, controllers: { registrations: 'users/registrations',
                                    sessions: 'users/sessions',
                                    passwords: 'users/passwords' }

  resources :users, has_many: :comments do
    collection do
      get :validation,      to: 'users#validation'
    end

    member do
      get   :show,          to: 'users#show',               as: :root
      get   :preference,    to: 'users#preference',         as: :preference
      post  :preference,    to: 'users#update_preference',  as: :update_preference
      get   :temporary,     to: 'users#temporary',          as: :temporary
      get   :bookmark,      to: 'users#bookmark',           as: :bookmark
    end
  end

  # Articles
  resources :articles, has_many: :comments do
    collection do
      get   :search,        to: 'articles#search'
      get   :autocomplete,  to: 'articles#autocomplete'
    end

    member do
      get   :history,   to: 'articles#history'
      get   :restore,   to: 'articles#restore'
      post  :bookmark,  to: 'articles#bookmark'
    end
  end

  # Tags
  resources :tags do
  end

  # Static pages
  get   :terms_of_use,  to: 'static_pages#terms_of_use'

  # Sidekiq interface
  mount Sidekiq::Web => '/sidekiq'

end
