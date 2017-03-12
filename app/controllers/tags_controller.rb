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

  respond_to :json

  def index
    tags = Tag.includes(:user, :parents, :child_relationship, :children, :parent_relationship).order('tags.name ASC')

    tags = tags.for_user_topic(current_user.id, current_user.current_topic_id) if params[:init] && current_user

    tags = if current_user&.admin?
             tags.all
           elsif current_user && params[:user_tags]
             tags.everyone_and_user_and_topic(current_user.id, current_user.current_topic_id)
           elsif current_user && tag_params[:topic_id] && tag_params[:user_id] && current_user.id == tag_params[:user_id].to_i
             tags.everyone_and_user_and_topic(current_user.id, tag_params[:topic_id].to_i)
           elsif current_user && tag_params[:user_id] && current_user.id == tag_params[:user_id].to_i
             tags.everyone_and_user(current_user.id)
           else
             tags.everyone
           end

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

  private

  def tag_params
    if params[:tags]
      params.require(:tags).permit(:name,
                                   :description,
                                   :user_id,
                                   :topic_id)
    else
      {}
    end
  end
end
