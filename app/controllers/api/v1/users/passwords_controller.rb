# frozen_string_literal: true

module Api::V1
  class Users::PasswordsController < Devise::PasswordsController
    layout 'full_page'

  end
end
