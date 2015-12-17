# == Schema Information
#
# Table name: articles
#
#  id              :integer          not null, primary key
#  author_id       :integer          not null
#  visibility      :integer          default(0), not null
#  notation        :integer          default(0)
#  priority        :integer          default(0)
#  allow_comment   :boolean          default(TRUE), not null
#  private_content :boolean          default(FALSE), not null
#  is_link         :boolean          default(FALSE), not null
#  temporary       :boolean          default(FALSE), not null
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class ArticleSerializer < ActiveModel::Serializer
  cache key: 'article', expires_in: 12.hours

  attributes :id,
             :slug,
             :title,
             :summary,
             :content,
             :visibility,
             :temporary,
             :is_link,
             :is_bookmarked,
             :allow_comment,
             :comments_number,
             :updated_at,
             :show

  belongs_to :author, serializer: UserSerializer
  has_many :tags, serializer: SimpleTagSerializer
  has_many :parent_tags, serializer: SimpleTagSerializer
  has_many :child_tags, serializer: SimpleTagSerializer
  has_many :comments

  def content
    current_user_id = defined?(current_user) && current_user ? current_user.id : nil
    object.adapted_content(current_user_id)
  end

  def is_bookmarked
    if defined?(current_user) && current_user
      object.user_bookmarks.exists?(current_user.id)
    else
      false
    end
  end

  def updated_at
    I18n.l(object.updated_at, format: :custom).downcase
  end

  def comments_number
    object.tracker.comments_count
  end

  def comments
    object.comments_tree.flatten if options[:comments]
  end

  def show
    true
  end
end

