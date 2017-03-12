# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  commentable_type :string           not null
#  commentable_id   :integer          not null
#  user_id          :integer          not null
#  title            :string
#  body             :text
#  subject          :string
#  rating           :integer          default(0)
#  positive_reviews :integer          default(0)
#  negative_reviews :integer          default(0)
#  accepted         :boolean          default(TRUE), not null
#  deleted_at       :datetime
#  parent_id        :integer
#  lft              :integer
#  rgt              :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class Comment < ApplicationRecord

  # == Attributes ===========================================================
  # Strip whitespaces
  auto_strip_attributes :title, :subject, :body

  # == Extensions ===========================================================
  # Act as a nested tree
  acts_as_nested_set scope: [:commentable_id, :commentable_type]

  # Marked as deleted
  acts_as_paranoid

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :user, recipient: :commentable

  # == Relationships ========================================================
  belongs_to :user

  belongs_to :commentable,
             polymorphic: true,
             counter_cache: true

  # == Validations ==========================================================
  validates :commentable,
            presence: true
  validates :user,
            presence: true

  validates :title,
            length: { minimum: CONFIG.comment_title_min_length, maximum: CONFIG.comment_title_max_length },
            if:     'title.present?'
  validates :body,
            presence: true,
            length:   { minimum: CONFIG.comment_body_min_length, maximum: CONFIG.comment_body_max_length }

  # == Scopes ===============================================================
  # Helper class method to lookup all comments assigned
  # to all commentable types for a given user.
  scope :find_comments_by_user, -> (user) {
    where(user_id: user.id).order('comments.created_at DESC')
  }

  # Helper class method to look up all comments for
  # commentable class name and commentable id.
  scope :find_comments_for_commentable, -> (commentable_str, commentable_id) {
    where(commentable_type: commentable_str.to_s, commentable_id: commentable_id).order('comments.created_at DESC')
  }

  # == Callbacks ============================================================

  # == Class Methods ========================================================
  # Helper class method that allows you to build a comment
  # by passing a commentable object, a user_id, and comment text
  # example in readme
  def self.build_from(commentable, user_id, comment_message)
    new commentable: commentable,
        body:        comment_message,
        user_id:     user_id
  end

  # Helper class method to look up a commentable object
  # given the commentable class name and id
  def self.find_commentable(commentable_str, commentable_id)
    commentable_str.constantize.find(commentable_id)
  end

  # == Instance Methods =====================================================
  # Delete comment with his children
  def destroy_with_children
    destroyed_comment_ids = []
    self.descendants.each do |comment|
      comment.destroy
      destroyed_comment_ids << comment.id
    end

    self.destroy ? destroyed_comment_ids << self.id : false
  end

  #helper method to check if a comment has children
  def has_children?
    self.children.any?
  end

end
