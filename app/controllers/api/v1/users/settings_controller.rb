# frozen_string_literal: true

module Api::V1
  class Users::SettingsController < ApiController
    after_action :verify_authorized

    respond_to :json

    def index
      user = User.find(params[:user_id])
      authorize user, :settings?

      expires_in InRailsWeBlog.config.cache_time, public: true
      if stale?(user, template: false, public: true)
        respond_to do |format|
          format.json do
            render json: UserSettingSerializer.new(user)
          end
        end
      end
    end

    def update
      user = User.find(params[:user_id])
      authorize user, :settings?

      topic = if params[:topic_id].present?
                user.topics.find_by(id: params[:topic_id])
              elsif params[:topic_slug].present?
                user.topics.find_by(slug: params[:topic_slug])
              end

      if params[:settings].present?
        params[:settings].each do |pref_type, pref_value|
          if pref_value == 'true'
            pref_value = true
          elsif pref_value == 'false'
            pref_value = false
          end

          if topic && topic.storext_definitions.key?(pref_type.to_sym)
            topic.settings[pref_type.to_s.downcase] = pref_value
          else
            user.settings[pref_type.to_s.downcase] = pref_value
          end
        end

        topic ? topic.save : user.save
      end

      respond_to do |format|
        format.json do
          render json: UserSettingSerializer.new(topic || user,
                                                 meta: { topic: !!topic })
        end
      end
    end

  end
end
