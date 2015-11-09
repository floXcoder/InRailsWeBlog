# == Schema Information
#
# Table name: articles
#
#  id              :integer          not null, primary key
#  author_id       :integer          not null
#  visibility      :integer          default(0), not null
#  notation        :integer          default(0)
#  priority        :integer          default(0)
#  allow_comment   :boolean          default(FALSE), not null
#  private_content :boolean          default(FALSE), not null
#  is_link         :boolean          default(FALSE), not null
#  temporary       :boolean          default(FALSE), not null
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class ArticleSerializer < ActiveModel::Serializer
  cache key: 'article', expires_in: 12.hours

  attributes :id, :slug, :title, :summary, :content, :visibility, :temporary, :is_link, :is_bookmarked, :updated_at, :show

  belongs_to :author, serializer: UserSerializer
  has_many :tags, serializer: SimpleTagSerializer
  has_many :parent_tags, serializer: SimpleTagSerializer
  has_many :child_tags, serializer: SimpleTagSerializer

  def content
    current_user_id = if scope
                        scope.id
                      else
                        current_user ? current_user.id : nil
                      end

    object.adapted_content(current_user_id)
  end

  def is_bookmarked
    current_user.bookmarks.exists?(object.id)
  end

  def updated_at
    I18n.l(object.updated_at, format: :custom).downcase
  end

  def show
    true
  end
end

