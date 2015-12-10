# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  commentable_id   :integer
#  commentable_type :string
#  title            :string
#  body             :text
#  subject          :string
#  user_id          :integer          not null
#  parent_id        :integer
#  lft              :integer
#  rgt              :integer
#  created_at       :datetime
#  updated_at       :datetime
#

class CommentSerializer < ActiveModel::Serializer
  cache key: 'comment', expires_in: 12.hours

  attributes :id, :title, :body, :subject, :parent_id, :nested_level, :posted_at, :user

  def nested_level
    object.level
  end

  def posted_at
    I18n.l(object.created_at, format: :custom).downcase
  end

  def user
    {
      id: object.user.id,
      pseudo: object.user.pseudo,
      slug: object.user.slug
    }
  end
end
