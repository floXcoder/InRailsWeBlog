# frozen_string_literal: true

module Api::V1
  class ApiController < ApplicationController
    # Verify by default that user is connected
    before_action :authenticate_user!

    before_action :verify_requested_format!

    protected

    def set_context_user
      @context_user ||= params[:user_id].present? ? User.friendly.find(params[:user_id]) : current_user

      raise ActiveRecord::RecordNotFound unless @context_user
    end
  end
end
