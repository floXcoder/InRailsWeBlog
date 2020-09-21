# frozen_string_literal: true

module Api::V1
  class ApiController < ApplicationController
    # Verify by default that user is connected
    before_action :authenticate_user!

    before_action :verify_requested_format!

  end
end
