# frozen_string_literal: true

class TopicsController < ApplicationController
  before_action :authenticate_user!, except: [:show]

  before_action :set_context_user, only: [:show]

  after_action :verify_authorized, only: [:show]

  include TrackerConcern

  respond_to :html

  def show
    topic = @context_user.topics.friendly.find(params[:topic_slug])
    authorize topic

    track_visit(Topic, topic.id, current_user&.id)

    expires_in InRailsWeBlog.config.cache_time, public: true
    if stale?(topic, template: false, public: true)
      respond_to do |format|
        format.html do
          set_seo_data(:user_topic,
                       topic_slug: topic,
                       user_slug:  topic.user,
                       author:     topic.user.pseudo)

          topic = topic.serialized_json('normal',
                                        meta: meta_attributes)

          render_associated_page(topic: topic)
        end
      end
    end
  end

end
