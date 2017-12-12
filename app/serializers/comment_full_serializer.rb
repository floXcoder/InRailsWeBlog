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

class CommentFullSerializer < ActiveModel::Serializer
  cache key: 'comment_full', expires_in: 12.hours

  attributes :id,
             :title,
             :body,
             :subject,
             :rating,
             :parent_id,
             :nested_level,
             :posted_at,
             :accepted,
             :user,
             :commentable_type,
             :link

  belongs_to :commentable
  belongs_to :user, serializer: UserSampleSerializer

  def nested_level
    object.level
  end

  def posted_at
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  include Rails.application.routes.url_helpers
  def link
    if object.commentable.is_a?(Article)
      "#{article_path(object.commentable)}#comment-#{object.id}"
    else
      '#'
    end
  end

  def commentable
    if object.commentable.is_a?(Article)
      ArticleSampleSerializer.new(object.commentable, base_url: true).attributes
    else
      object.commentable
    end
  end
end
