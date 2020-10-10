# frozen_string_literal: true

class TagsController < ApplicationController
  after_action :verify_authorized, only: [:show, :edit]

  respond_to :html

  def index
    tags = ::Tags::FindQueries.new.all(filter_params.merge(limit: params[:limit]))

    expires_in InRailsWeBlog.config.cache_time, public: true
    if stale?(tags, template: false, public: true)
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

    expires_in InRailsWeBlog.config.cache_time, public: true
    if stale?(tag, template: false, public: true)
      respond_to do |format|
        format.html do
          set_seo_data(:show_tag,
                       tag_slug: tag,
                       author:   tag.user.pseudo)

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
