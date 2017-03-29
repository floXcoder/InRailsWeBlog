# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  user_id  :integer          not null
#  name       :string           not null
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class TagsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  after_action :verify_authorized, except: [:index]

  include TrackerConcern
  include CommentConcern
  
  respond_to :json

  def index
    tags = Tag
             .includes(:user, :parents, :child_relationship, :children, :parent_relationship)
             .order('tags.name ASC')
             .distinct

    tags = tags.default_visibility(current_user, current_admin)

    tags = Tag.filter_by(tags, filter_params, current_user) unless filter_params.empty?

    tags = params[:limit] ? tags.limit(params[:limit]) : tags.paginate(page: params[:page], per_page: CONFIG.per_page)

    respond_to do |format|
      format.json do
        render json:            tags,
               each_serializer: TagSerializer
      end
    end
  end

  def show
    tag = Tag.includes(:user).friendly.find(params[:id])
    authorize tag

    respond_to do |format|
      format.html do
        expires_in 3.hours, public: true
        set_meta_tags title:       titleize(I18n.t('views.tag.show.title')),
                      description: I18n.t('views.tag.show.description'),
                      author:      user_canonical_url(tag.user.slug),
                      canonical:   tag_canonical_url(tag.slug),
                      alternate:   alternate_urls('tags', tag.slug),
                      og:          {
                        type:  'InRailsWeBlog:tag',
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
          render json:   tag.errors,
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
          render json:   { id: tag.id },
                 status: :accepted
        else
          flash.now[:error] = I18n.t('views.tag.flash.deletion_error', errors: tag.errors.to_s)
          render json:   tag.errors,
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
