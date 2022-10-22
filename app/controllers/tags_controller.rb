# frozen_string_literal: true

class TagsController < ApplicationController
  before_action :authenticate_user!, only: [:edit]

  before_action :set_context_user, only: [:edit]

  after_action :verify_authorized, only: [:show, :edit]

  include TrackerConcern

  respond_to :html

  def index
    not_found_error and return if (params[:user_slug].present? && !User.find_by(slug: params[:user_slug])) || (params[:topic_slug].present? && !Topic.find_by(slug: params[:topic_slug]))

    tags = ::Tags::FindQueries.new.all(filter_params.merge(user_slug: params[:user_slug], topic_slug: params[:topic_slug], limit: params[:limit]&.to_i))

    track_action(tag_ids: tags.map(&:id))

    with_cache? ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
    if !with_cache? || stale?(tags, template: false, public: true)
      respond_to do |format|
        format.html do
          set_seo_data(:tags)

          tags = Tag.serialized_json(tags,
                                     'normal',
                                     meta: meta_attributes)

          render_associated_page(tags: tags)
        end
      end
    end
  end

  def show
    tag = Tag.include_element.friendly.find(params[:tag_slug])
    authorize tag

    track_action(tag_id: tag.id) { track_visit(Tag, tag.id, current_user&.id, nil) }

    with_cache?(tag) ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
    if !with_cache?(tag) || stale?(tag, template: false, public: true)
      respond_to do |format|
        format.html do
          set_seo_data(:show_tag,
                       model:       tag,
                       tag_slug:    tag,
                       tag_content: tag.description&.summary(InRailsWeBlog.settings.seo_meta_desc_length, strip_html: true, remove_links: true),
                       author:      tag.user.pseudo)

          tag = tag.serialized_json('complete',
                                    params: { current_user_id: current_user&.id },
                                    meta:   meta_attributes)

          render_associated_page(tag: tag)
        end
      end
    end
  end

  def edit
    not_found_error and return unless current_user

    tag = current_user.tags.include_element.friendly.find(params[:tag_slug])
    authorize tag

    track_action(tag_id: tag.id)

    respond_to do |format|
      format.html do
        set_seo_data(:edit_tag,
                     tag_slug:  tag,
                     user_slug: tag.user,
                     author:    tag.user.pseudo)

        tag = tag.serialized_json('complete',
                                  params: { current_user_id: current_user&.id },
                                  meta:   meta_attributes)

        render_associated_page(tag: tag)
      end
    end
  end

  private

  def filter_params
    if params[:filter]
      params.require(:filter).permit(:visibility,
                                     :order,
                                     :user_id,
                                     :user_slug,
                                     :topic_id,
                                     :topic_slug).reject { |_, v| v.blank? }
    else
      {}
    end
  end

end
