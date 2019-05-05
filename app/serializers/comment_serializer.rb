# frozen_string_literal: true

# == Schema Information
#
# Table name: comments
#
#  id               :bigint           not null, primary key
#  user_id          :bigint           not null
#  commentable_type :string           not null
#  commentable_id   :bigint           not null
#  title            :string
#  subject          :string
#  body             :text
#  rating           :integer          default(0)
#  positive_reviews :integer          default(0)
#  negative_reviews :integer          default(0)
#  accepted         :boolean          default(TRUE), not null
#  ask_for_deletion :boolean          default(FALSE), not null
#  deleted_at       :datetime
#  parent_id        :integer
#  lft              :integer
#  rgt              :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class CommentSerializer < ActiveModel::Serializer
  cache key: 'comment', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :title,
             :body,
             :subject,
             :rating,
             :parent_id,
             :nested_level,
             :posted_at,
             :user

  belongs_to :user, serializer: UserSampleSerializer

  def nested_level
    object.level
  end

  def posted_at
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end
end
