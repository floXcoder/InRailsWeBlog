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

class TagsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :verify_requested_format!
  after_action :verify_authorized, except: [:index]

  include TrackerConcern
  include CommentConcern

  respond_to :html, :json

  def index
    tags = Tag.includes(:user, :parents, :child_relationships, :children, :parent_relationships)
             .distinct

    tags = tags.order_by(filter_params[:order] || 'name')

    tags = tags.default_visibility(current_user, current_admin)

    # When filtering by topic, private tags not assigned to an article are not returned
    tags = Tag.filter_by(tags, filter_params, current_user) unless filter_params.empty?

    tags = tags.limit(params[:limit]) if params[:limit]

    respond_to do |format|
      format.json do
        render json:            tags,
               each_serializer: TagSerializer,
               current_topic_id: filter_params[:topic_id]
      end
    end
  end

  def show
    tag = Tag.includes(:user).friendly.find(params[:id])
    authorize tag

    respond_to do |format|
      format.html do
        expires_in 3.hours, public: true
        set_meta_tags title:       titleize(I18n.t('views.tag.show.title', name: tag.name)),
                      description: tag.meta_description,
                      author:      alternate_urls(tag.user.slug)['fr'],
                      canonical:   alternate_urls(tag.slug)['fr'],
                      alternate:   alternate_urls('tags', tag.slug),
                      og:          {
                        type:  "#{ENV['WEBSITE_NAME']}:tag",
                        url:   tag_url(tag),
                        image: root_url + tag.default_picture
                      }
        render :show, locals: { tag: tag }
      end

      format.json do
        render json:       tag,
               serializer: TagSerializer
      end
    end
  end

  def update
    tag = Tag.find(params[:id])
    admin_or_authorize tag

    tag.format_attributes(tag_params, current_user)

    respond_to do |format|
      format.json do
        if tag.save
          render json:   tag,
                 status: :ok
        else
          render json:   { errors: tag.errors },
                 status: :forbidden
        end
      end
    end
  end

  def destroy
    tag = Tag.find(params[:id])
    admin_or_authorize tag

    respond_to do |format|
      format.json do
        if params[:permanently] && current_admin ? tag.really_destroy! : tag.destroy
          flash.now[:success] = I18n.t('views.tag.flash.successful_deletion')
          head :no_content
        else
          flash.now[:error] = I18n.t('views.tag.flash.error_deletion', errors: tag.errors.to_s)
          render json:   { errors: tag.errors },
                 status: :forbidden
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

  def filter_params
    if params[:filter]
      params.require(:filter).permit(:visibility,
                                     :user_id,
                                     :topic_id,
                                     :accepted,
                                     :bookmarked,
                                     tag_ids:   [],
                                     user_ids:  [],
                                     topic_ids: []).reject { |_, v| v.blank? }
    else
      {}
    end
  end

end
