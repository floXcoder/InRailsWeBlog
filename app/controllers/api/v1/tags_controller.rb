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
        tags = ::Tags::FindQueries.new.populars(limit: params[:limit])
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

        tags = Rails.cache.fetch("user_tags:#{current_user&.id}_for_#{topic_id || current_user&.current_topic_id}", expires_in: InRailsWeBlog.config.cache_time) do
          ::Tags::FindQueries.new(current_user, current_admin).all(filter_params.merge(topic_id: topic_id, limit: params[:limit]))
        end
      else
        # set_seo_data(:tags)

        tags = ::Tags::FindQueries.new(current_user, current_admin).all(filter_params.merge(limit: params[:limit]))
      end

      expires_in InRailsWeBlog.config.cache_time, public: true
      if stale?(tags, template: false, public: true)
        respond_to do |format|
          format.json do
            if complete
              render json: TagCompleteSerializer.new(tags,
                                                     include: [:user, :tracker],
                                                     params:  { current_topic_id: topic_id },
                                                     meta:    { root: 'tags', **meta_attributes }).serializable_hash
            else
              render json: TagSerializer.new(tags,
                                             params: { current_topic_id: topic_id },
                                             meta:   { root: 'tags', **meta_attributes }).serializable_hash
            end
          end
        end
      end
    end

    def show
      tag = Tag.include_element.friendly.find(params[:id])
      authorize tag

      expires_in InRailsWeBlog.config.cache_time, public: true
      if stale?(tag, template: false, public: true)
        respond_to do |format|
          format.json do
            if params[:recommendation]
              render json: TagSampleSerializer.new(tag).serializable_hash
            else
              set_seo_data(:show_tag,
                           tag_slug: tag,
                           author:   tag.user.pseudo)

              render json: TagCompleteSerializer.new(tag,
                                                     include: [:user, :tracker],
                                                     params:  { current_user_id: current_user&.id },
                                                     meta:    meta_attributes).serializable_hash
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

          render json: TagCompleteSerializer.new(tag,
                                                 include: [:user, :tracker],
                                                 params:  { current_user_id: current_user&.id },
                                                 meta:    meta_attributes).serializable_hash
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
            render json: TagCompleteSerializer.new(stored_tag.result,
                                                   include: [:user, :tracker],
                                                   params:  { current_topic_id: current_user&.current_topic_id },
                                                   meta:    meta_attributes).serializable_hash
          else
            flash.now[:error] = stored_tag.message
            render json:   { errors: stored_tag.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def update_priority
      tags = []
      priority_params[:tag_ids].reverse.each_with_index do |id, i|
        tag = Tag.find(id)
        admin_or_authorize tag, :update?
        tags << tag if tag.update_columns(priority: i + 1)
      end

      respond_to do |format|
        format.json do
          if tags.present?
            flash.now[:success] = t('views.tag.flash.successful_priority_update')
            render json:   TagSerializer.new(tags.reverse,
                                             meta: { root: 'tags' }).serializable_hash,
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
                                    synonyms:            [],
                                    pictures_attributes: [:id,
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
                                       topic_ids: []).reject { |_, v| v.blank? }
      else
        {}
      end
    end

  end
end
