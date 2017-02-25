require 'support/pages/site_page'

class UserPage < SitePage
  attr_accessor :user_page

  def initialize(user_page)
    @user_page = user_page
  end

  def path
    @user_page
  end

  # def navigation_bar
  #   find('.col-xs-6.col-sm-3 div.list-group')
  # end

  def fill_in_update_profile(form_id, user_info)
    within ("form#{form_id}") do
      fill_in :user_first_name, with: user_info[:first_name]
      fill_in :user_last_name, with: user_info[:last_name]
      fill_in :user_city, with: user_info[:address]
      select  user_info[:country], from: :user_country
      click_button t('views.user.edit.update_profile')
    end
  end

  def fill_in_update_account(user_info)
    within ('form#edit_user') do
      fill_in :user_pseudo, with: user_info[:pseudo]
      fill_in :user_email, with: user_info[:email]
      fill_in :user_current_password, with: 'password'
      click_button t('devise.registrations.submit')
    end
  end

  def fill_in_password_account(user_info)
    within ('form#edit_user') do
      fill_in :user_password, with: user_info[:password]
      fill_in :user_password_confirmation, with: user_info[:password]
      fill_in :user_current_password, with: 'password'
      click_button t('devise.registrations.submit')
    end
  end

end
