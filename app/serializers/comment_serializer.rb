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

class CommentSerializer
  include FastJsonapi::ObjectSerializer

  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :title,
             :body,
             :subject,
             :rating,
             :parent_id

  belongs_to :user, serializer: UserSampleSerializer

  attribute :nested_level do |object|
    object.level
  end

  attribute :posted_at do |object|
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end
end
