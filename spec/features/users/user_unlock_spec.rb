# frozen_string_literal: true

# feature 'User Unlock', advanced: true, js: true do
#
#   background(:all) do
#     @user_info = { pseudo:   'Pseudo',
#                    email:    'test@inr.fr',
#                    password: 'new_password' }
#
#     @user = User.where(pseudo: @user_info[:email], email: @user_info[:email]).first || create(:user, pseudo: @user_info[:email], email: @user_info[:email])
#   end
#
#   given(:new_unlock_page) { UserPage.new(new_user_unlock_path) }
#
#   background do
#     logout
#     new_unlock_page.visit
#   end
#
#   subject { new_unlock_page }
#
#   feature 'New Unlock page' do
#     it_behaves_like 'a valid page' do
#       let(:content) {
#         {
#           current_page:    new_unlock_page,
#           title:           t('devise.unlocks.title'),
#           stylesheet_name: 'users/new',
#           javascript_name: 'users/password',
#           common_js:       ['commons-full-page'],
#           full_page:       true
#         }
#       }
#     end
#
#     scenario 'page has a valid HTML structure' do
#       is_expected.to have_valid_html
#     end
#   end
#
# end
