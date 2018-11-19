# frozen_string_literal: true

# feature 'Error Show page', advanced: true, js: true do
#
#   given(:error_page) { ErrorsPage.new('/404') }
#
#   background do
#     error_page.visit
#   end
#
#   subject { error_page }
#
#   feature 'users can see the page' do
#     it_behaves_like 'a valid page' do
#       let(:content) {
#         {
#           full_page:    true,
#           current_page: error_page,
#           title:        '',
#           asset_name:   'errors/error',
#           common_js:    ['commons']
#         }
#       }
#     end
#
#     scenario 'page has a valid HTML structure' do
#       is_expected.to have_valid_html
#     end
#   end
#
#   feature 'Error Show content' do
#     scenario 'user can see error message' do
#       is_expected.to have_content(t(404, scope: 'views.error.status.title', default: :default))
#     end
#   end
#
# end
