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

class Comment < ApplicationRecord

  # == Attributes ===========================================================
  # Strip whitespaces
  auto_strip_attributes :title, :subject

  # == Extensions ===========================================================
  # Act as a nested tree
  acts_as_nested_set scope: [:commentable_id, :commentable_type]

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user

  belongs_to :commentable,
             polymorphic: true,
             counter_cache: true

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :commentable,
            presence: true

  validates :title,
            length: { minimum: InRailsWeBlog.config.comment_title_min_length, maximum: InRailsWeBlog.config.comment_title_max_length },
            if:     -> { title.present? }
  validates :body,
            presence: true,
            length:   { minimum: InRailsWeBlog.config.comment_body_min_length, maximum: InRailsWeBlog.config.comment_body_max_length }

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

  def self.filter_by(records, filter, _current_user = nil)
    records = records.where(accepted: filter[:accepted]) if filter[:accepted]
    records = records.where(ask_for_deletion: filter[:ask_for_deletion]) if filter[:ask_for_deletion]
    records = records.find_comments_by_user(filter[:user_id]) if filter[:user_id]

    return records
  end

  def self.order_by(order)
    if order == 'id_asc'
      order('id ASC')
    elsif order == 'id_desc'
      order('id DESC')
    elsif order == 'updated_asc'
      order('updated_at ASC')
    elsif order == 'updated_desc'
      order('updated_at DESC')
    else
      all
    end
  end

  # == Instance Methods =====================================================
  #helper method to check if a comment has children
  def children?
    self.children.any?
  end

  # Delete comment with his children
  def destroy_with_children
    destroyed_comment_ids = []
    self.descendants.each do |comment|
      comment.destroy
      destroyed_comment_ids << comment.id
    end

    self.destroy ? destroyed_comment_ids << self.id : false
  end

end
