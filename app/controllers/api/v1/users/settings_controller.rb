# frozen_string_literal: true

module Api::V1
  class Users::SettingsController < ApplicationController
    before_action :authenticate_user!
    before_action :verify_requested_format!
    after_action :verify_authorized

    respond_to :json

    def index
      user = User.find(params[:user_id])
      authorize user, :settings?

      respond_to do |format|
        format.json do
          render json:       user,
                 root:       'settings',
                 serializer: SettingSerializer
        end
      end
    end

    def update
      user = User.find(params[:user_id])
      authorize user, :settings?

      topic = params[:topic_slug].present? ? user.topics.find_by(slug: params[:topic_slug]) : nil

      if params[:settings].present?
        params[:settings].each do |pref_type, pref_value|
          if pref_value == 'true'
            pref_value = true
          elsif pref_value == 'false'
            pref_value = false
          end
          if topic
            topic.settings[pref_type.to_s.downcase] = pref_value
          else
            user.settings[pref_type.to_s.downcase] = pref_value
          end
        end
        topic ? topic.save : user.save
      end

      respond_to do |format|
        format.json do
          render json:       (topic || user),
                 root:       'settings',
                 meta:       { topic: !!topic },
                 serializer: SettingSerializer
        end
      end
    end

  end
end
