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

    before_action :set_context_user, except: [:index]

    after_action :verify_authorized, except: [:index]

    include TrackerConcern
    include CommentConcern

    respond_to :html, :json

    def index
      topic_id = nil

      complete = filter_params[:complete] && admin_signed_in?

      tags = if complete
               ::Tags::FindQueries.new(nil, current_admin).complete
             elsif params[:populars]
               ::Tags::FindQueries.new.populars(limit: params[:limit])
             elsif params[:user_id] && (filter_params[:topic_slug].present? || filter_params[:topic_id].present?)
               topic_id = if filter_params[:topic_slug]
                            User.friendly.find(params[:user_id]).topics.friendly.find(filter_params[:topic_slug]).id
                          else
                            filter_params[:topic_id].to_i
                          end
               Rails.cache.fetch("user_tags:#{current_user&.id}_for_#{topic_id || current_user&.current_topic_id}", expires_in: InRailsWeBlog.config.cache_time) do
                 ::Tags::FindQueries.new(current_user, current_admin).all(filter_params.merge(topic_id: topic_id, limit: params[:limit]))
               end
             else
               ::Tags::FindQueries.new(current_user, current_admin).all(filter_params.merge(limit: params[:limit]))
             end

      respond_to do |format|
        if filter_params[:user_slug].present?
          set_meta_tags title: titleize(I18n.t('views.tag.index.title.user', user: User.find_by(slug: filter_params[:user_slug]).pseudo))
        elsif filter_params[:topic_slug].present?
          set_meta_tags title: titleize(I18n.t('views.tag.index.title.topic', topic: Topic.friendly.find(filter_params[:topic_slug]).name))
        elsif filter_params[:user_id].blank?
          set_meta_tags title: titleize(I18n.t('views.tag.index.title.default'))
        end

        format.json do
          render json:             tags,
                 each_serializer:  complete ? TagCompleteSerializer : TagSerializer,
                 current_topic_id: topic_id,
                 meta:             meta_attributes
        end
      end
    end

    def show
      tag = @context_user.tags.include_element.friendly.find(params[:id])
      authorize tag

      respond_to do |format|
        format.json do
          set_meta_tags title:       titleize(I18n.t('views.tag.show.title', name: tag.name)),
                        description: tag.meta_description,
                        author:      tag.user.pseudo

          render json:            tag,
                 serializer:      TagCompleteSerializer,
                 current_user_id: current_user&.id,
                 meta:            meta_attributes
        end
      end
    end

    def edit
      tag = current_user.tags.include_element.friendly.find(params[:id])
      authorize tag

      respond_to do |format|
        format.json do
          set_meta_tags title:       titleize(I18n.t('views.tag.edit.title', name: tag.name)),
                        description: tag.meta_description

          render json:            tag,
                 serializer:      TagCompleteSerializer,
                 current_user_id: current_user&.id,
                 meta:            meta_attributes
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
            render json:             stored_tag.result,
                   serializer:       TagSerializer,
                   current_topic_id: current_user&.current_topic_id
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
            render json:            tags.reverse,
                   each_serializer: TagSerializer,
                   status:          :ok
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
