# frozen_string_literal: true

module Api::V1
  class ApiController < ApplicationController
    # Verify by default that user is connected
    before_action :authenticate_user!

    before_action :verify_requested_format!

    protected

    def set_context_user
      @context_user ||= if params[:user_id].present?
                          (current_user&.id == params[:user_id].to_i || current_user&.slug == params[:user_id].to_s) ? current_user : User.friendly.find(params[:user_id])
                        else
                          current_user
                        end

      raise ActiveRecord::RecordNotFound unless @context_user
    end
  end
end
