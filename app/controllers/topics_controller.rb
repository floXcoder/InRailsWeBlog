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

    # Redirect to the correct localized topic
    redirect_to(topic.link_path(locale: topic.languages.first), status: :moved_permanently) and return if topic.languages? && topic.languages.exclude?(I18n.locale.to_s)

    track_action(topic_id: topic.id) { track_visit(Topic, topic.id, current_user&.id, nil) }

    with_cache?(topic) ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
    if !with_cache?(topic) || stale?(topic, template: false, public: true)
      respond_to do |format|
        format.html do
          set_seo_data(:user_topic,
                       model:         topic,
                       topic_slug:    topic,
                       topic_content: topic.description&.summary(InRailsWeBlog.settings.seo_meta_desc_length, strip_html: true, remove_links: true),
                       user_slug:     topic.user,
                       author:        topic.user.pseudo)

          topic = topic.serialized_json('normal',
                                        meta: meta_attributes)

          render_associated_page(topic: topic)
        end
      end
    end
  end

end
