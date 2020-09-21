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
            render json: UserSettingSerializer.new(user).serializable_hash
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
            if pref_value == 'default'
              topic.settings.delete(pref_type.to_s.downcase)
            else
              topic.settings[pref_type.to_s.downcase] = pref_value
            end
          else
            user.settings[pref_type.to_s.downcase] = pref_value
          end
        end

        topic ? topic.save : user.save
      end

      respond_to do |format|
        format.json do
          # Ensure current topic preferences are not changed
          user.settings = user.settings.merge(topic&.settings || user.current_topic.settings)
          render json: UserSettingSerializer.new(user,
                                                 meta: { topic: !!topic }).serializable_hash
        end
      end
    end

  end
end
