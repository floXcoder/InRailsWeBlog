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
#                root_user GET    /users/:id/main(.:format)         users#main {:has_many=>:comments}
#        notification_user GET    /users/:id/notification(.:format) users#notification {:has_many=>:comments}
#                 id_users GET    /users/id(.:format)               users#check_id {:has_many=>:comments}
#                    users GET    /users(.:format)                  users#index {:has_many=>:comments}
#                          POST   /users(.:format)                  users#create {:has_many=>:comments}
#                 new_user GET    /users/new(.:format)              users#new {:has_many=>:comments}
#                edit_user GET    /users/:id/edit(.:format)         users#edit {:has_many=>:comments}
#                     user GET    /users/:id(.:format)              users#show {:has_many=>:comments}
#                          PATCH  /users/:id(.:format)              users#update {:has_many=>:comments}
#                          PUT    /users/:id(.:format)              users#update {:has_many=>:comments}
#                          DELETE /users/:id(.:format)              users#destroy {:has_many=>:comments}
#             terms_of_use GET    /terms_of_use(.:format)           static_pages#terms_of_use
#              sidekiq_web        /sidekiq                          Sidekiq::Web
#

require 'sidekiq/web'

Rails.application.routes.draw do

  # Root path
  root                  'static_pages#home'

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
    member do
      get :main,          to: 'users#main',         as: :root
      get :notification,  to: 'users#notification', as: :notification
    end

    collection do
      get :id,            to: 'users#check_id'
    end
  end

  # Static pages
  get     :terms_of_use,  to: 'static_pages#terms_of_use'


  # Sidekiq interface
  mount Sidekiq::Web => '/sidekiq'

end
