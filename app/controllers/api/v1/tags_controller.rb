# frozen_string_literal: true

# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  name       :string           not null
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

module Api::V1
  class TagsController < ApiController
    skip_before_action :authenticate_user!, only: [:index, :show]
    skip_before_action :track_ahoy_visit, only: [:index]

    # Require for tracker concern
    before_action :set_context_user, only: []

    after_action :verify_authorized, except: [:index]

    include TrackerConcern
    include CommentConcern

    respond_to :html, :json

    def index
      topic_id = nil

      complete = filter_params[:complete] && admin_signed_in?

      if complete
        tags = ::Tags::FindQueries.new(nil, current_admin).complete
      elsif params[:populars]
        tags = component_cache('popular_tags') do
          Tag.serialized_json(::Tags::FindQueries.new.populars(limit: params[:limit]&.to_i),
                              'normal')
        end
      elsif params[:user_id] && (filter_params[:topic_slug].present? || filter_params[:topic_id].present?)
        topic_id = if filter_params[:topic_slug]
                     User.friendly.find_by(id: params[:user_id])&.topics&.find_by(slug: filter_params[:topic_slug])&.id
                   else
                     filter_params[:topic_id].to_i
                   end

        if filter_params[:topic_slug] && params[:user_id]&.to_i == 0
          topic = Topic.friendly.find(filter_params[:topic_slug])
          set_seo_data(:topic_tags,
                       topic_slug: topic,
                       user_slug:  topic.user)
        end

        tags = component_cache("user_tags:#{params[:user_id]}_for_#{topic_id || current_user&.current_topic_id}") do
          Tag.serialized_json(::Tags::FindQueries.new(current_user, current_admin).all(filter_params.merge(topic_id: topic_id, limit: params[:limit]&.to_i)),
                              'normal',
                              params: { current_topic_id: topic_id })
        end
      elsif filter_params[:user_id] || current_user
        tags = component_cache("user_tags:#{filter_params[:user_id] || current_user.id}") do
          Tag.serialized_json(::Tags::FindQueries.new(current_user, current_admin).all(filter_params.merge(limit: params[:limit]&.to_i)),
                              'normal',
                              params: { current_topic_id: topic_id })
        end
      else
        tags = ::Tags::FindQueries.new.all(filter_params.merge(limit: params[:limit]&.to_i))
      end

      with_cache? ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
      if tags.is_a?(Hash) || (!with_cache? || stale?(tags, template: false, public: true))
        respond_to do |format|
          format.json do
            if complete
              render json: Tag.serialized_json(tags,
                                               'complete',
                                               params: { current_topic_id: topic_id, no_cache: complete },
                                               meta:   meta_attributes)
            else
              render json: if tags.is_a?(Hash)
                             tags
                           else
                             Tag.serialized_json(tags,
                                                 'normal',
                                                 params: { current_topic_id: topic_id },
                                                 meta:   meta_attributes)
                           end
            end
          end
        end
      end
    end

    def show
      tag = Tag.include_element.friendly.find(params[:id])
      authorize tag

      with_cache?(tag) ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
      if !with_cache?(tag) || stale?(tag, template: false, public: true)
        respond_to do |format|
          format.json do
            if params[:recommendation]
              render json: tag.serialized_json
            else
              set_seo_data(:show_tag,
                           model:       tag,
                           tag_content: tag.description&.summary(InRailsWeBlog.settings.seo_meta_desc_length, strip_html: true, remove_links: true),
                           tag_slug:    tag,
                           author:      tag.user.pseudo)

              render json: tag.serialized_json('complete',
                                               params: { current_user_id: current_user&.id },
                                               meta:   {
                                                         trackingData: { tag_id: tag.id },
                                                         **(params[:no_meta] ? {} : meta_attributes)
                                                       }.compact)
            end
          end
        end
      end
    end

    def edit
      tag = current_user.tags.include_element.friendly.find(params[:id])
      authorize tag

      respond_to do |format|
        format.json do
          set_seo_data(:edit_tag,
                       tag_slug:  tag,
                       user_slug: tag.user,
                       author:    tag.user.pseudo)

          render json: tag.serialized_json('complete',
                                           params: { current_user_id: current_user&.id },
                                           meta:   {
                                             trackingData: { tag_id: tag.id },
                                             **meta_attributes
                                           })
        end
      end
    end

    def update
      tag = current_user.tags.find(params[:id])
      admin_or_authorize tag

      stored_tag = ::Tags::StoreService.new(tag, tag_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          if stored_tag.success?
            track_action(action: 'tag_update', tag_id: stored_tag.result.id)

            render json: stored_tag.result.serialized_json('complete',
                                                           params: { current_topic_id: current_user&.current_topic_id },
                                                           meta:   meta_attributes)
          else
            flash.now[:error] = stored_tag.message
            render json:   { errors: stored_tag.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def update_priority
      sorted_tags = []
      tags        = Tag.includes(:tagged_articles, :parent_relationships, :child_relationships).where(id: priority_params[:tag_ids].reverse)
      tags.each_with_index do |tag, i|
        admin_or_authorize tag, :update?
        sorted_tags << tag if tag.update_columns(priority: i + 1)
      end

      respond_to do |format|
        format.json do
          if sorted_tags.present?
            flash.now[:success] = t('views.tag.flash.successful_priority_update')
            render json:   Tag.serialized_json(sorted_tags.reverse, 'normal'),
                   status: :ok
          else
            flash.now[:error] = t('views.tag.flash.error_priority_update')
            render json:   { errors: t('views.tag.flash.error_priority_update') },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def destroy
      tag = current_user.tags.find(params[:id])
      admin_or_authorize tag

      respond_to do |format|
        format.json do
          if params[:permanently] && current_admin ? tag.really_destroy! : tag.destroy
            track_action(action: 'tag_destroy', tag_id: tag.id)

            flash.now[:success] = I18n.t('views.tag.flash.successful_deletion')
            head :no_content
          else
            flash.now[:error] = I18n.t('views.tag.flash.error_deletion', errors: tag.errors.to_s)
            render json:   { errors: tag.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    private

    def tag_params
      if params[:tag]
        params.require(:tag).permit(:name,
                                    :description,
                                    :color,
                                    :priority,
                                    :visibility,
                                    :accepted,
                                    :archived,
                                    :picture,
                                    description_translations: {},
                                    synonyms:                 [],
                                    pictures_attributes:      [:id,
                                                               :image,
                                                               :_destroy])
      else
        {}
      end
    end

    def priority_params
      if params[:tag_ids]
        params.permit(tag_ids: [])
      else
        {}
      end
    end

    def filter_params
      if params[:filter]
        params.require(:filter).permit(:visibility,
                                       :order,
                                       :user_id,
                                       :user_slug,
                                       :topic_id,
                                       :topic_slug,
                                       :accepted,
                                       :bookmarked,
                                       :complete,
                                       tag_ids:   [],
                                       user_ids:  [],
                                       topic_ids: []).compact_blank
      else
        {}
      end
    end

  end
end
