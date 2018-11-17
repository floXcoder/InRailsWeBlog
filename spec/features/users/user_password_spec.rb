# frozen_string_literal: true

# feature 'User Password', advanced: true, js: true do
#
#   background(:all) do
#     @user_info = { pseudo:   'Pseudo',
#                    email:    'test@inrailsweblog.fr',
#                    password: 'new_password' }
#
#     @user = User.where(pseudo: @user_info[:email], email: @user_info[:email]).first || create(:user, pseudo: @user_info[:email], email: @user_info[:email])
#
#     @password_token = Devise.friendly_token
#   end
#
#   given(:new_password_page) { UserPage.new(new_user_password_path) }
#   given(:edit_password_page) { UserPage.new(edit_user_password_path(reset_password_token: @password_token)) }
#
#   feature 'New Password page' do
#     background do
#       logout
#       new_password_page.visit
#     end
#
#     subject { new_password_page }
#
#     it_behaves_like 'a valid page' do
#       let(:content) {
#         {
#           current_page:    new_password_page,
#           title:           t('devise.passwords.new.title'),
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
#   feature 'Edit Password content' do
#     background do
#       logout
#       edit_password_page.visit
#     end
#
#     subject { edit_password_page }
#
#     it_behaves_like 'a valid page' do
#       let(:content) {
#         {
#           current_page:    edit_password_page,
#           title:           t('devise.passwords.edit.title'),
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
