# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  tagger_id  :integer          not null
#  name       :string           not null
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class TagsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  after_action :verify_authorized, except: [:index, :show]

  include TrackerConcern

  respond_to :html, :js, :json

  def index
    tags = Tag.includes(:children).all.order('name ASC')

    respond_to do |format|
      format.html { render json: tags, formats: :json, content_type: 'application/json' }
      format.json { render json: tags }
    end
  end

  def show
    tag = Tag.friendly.find(params[:id])

    current_user_id = current_user ? current_user.id : nil

    articles = Article
                 .includes(:translations,
                           :author,
                           :parent_tags,
                           :child_tags,
                           :tagged_articles,
                           :tracker,
                           tags: [:tagged_articles],
                           bookmarked_articles: [:user, :article])
                 .user_related(current_user_id)
                 .joins(:tags)
                 .where(tags: { name: tag.name })
                 .order('articles.id DESC')

    Article.track_views(articles.ids)
    User.track_views(articles.map { |article| article.author.id })
    Tag.track_views(tag.id)

    respond_to do |format|
      format.html { render :show,
                           locals: {
                             tag:             tag,
                             articles:        articles,
                             current_user_id: current_user_id
                           }
      }
    end
  end

  def create
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private

  def tag_params
    params.require(:tags).permit(:name)
  end
end
