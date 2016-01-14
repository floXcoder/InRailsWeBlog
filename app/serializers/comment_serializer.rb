# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  commentable_id   :integer          not null
#  commentable_type :string           not null
#  user_id          :integer          not null
#  title            :string
#  body             :text
#  subject          :string
#  rating           :integer          default(0)
#  positive_reviews :integer          default(0)
#  negative_reviews :integer          default(0)
#  parent_id        :integer
#  lft              :integer
#  rgt              :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class CommentSerializer < ActiveModel::Serializer
  cache key: 'comment', expires_in: 12.hours

  attributes :id,
             :title,
             :body,
             :subject,
             :parent_id,
             :nested_level,
             :posted_at,
             :user

  def nested_level
    object.level
  end

  def posted_at
    I18n.l(object.created_at, format: :custom).downcase
  end

  def user
    UserSampleSerializer.new(object.user).attributes
  end
end
