# frozen_string_literal: true

module CommentableConcern
  extend ActiveSupport::Concern

  included do
    acts_as_commentable

    # Helpers
    scope :most_rated, -> { order('notation DESC') if self.column_names.include?(:notation) }
    scope :recently_rated, -> { where(updated_at: 15.days.ago..Time.zone.now) if self.column_names.include?(:notation) }
  end

  def comments
    self.comment_threads
  end

  def new_comment(comment)
    self.add_comment(comment)

    self.update_notation

    self.save
  end

  def update_comment(comment, new_comment_attributes)
    new_comment_attributes.delete(:rating) if new_comment_attributes[:rating].blank?

    comment_updated = comment.update(new_comment_attributes)

    self.update_notation

    return comment_updated
  end

  def remove_comment(comment)
    if self.comment_threads.exists?(comment.id)
      if (comments_destroyed = comment.destroy_with_children)
        self.update_notation
        comments_destroyed
      end
    else
      false
    end
  end

  def comments_tree(page = nil, per_page = nil)
    comments = self.root_comments.includes(user: [:picture]).order('comments.created_at ASC')
    comments = comments.paginate(page: page, per_page: per_page || InRailsWeBlog.settings.per_page) if page

    comments_tree = comments.map(&:self_and_descendants)

    return comments, comments_tree.flatten
  end

  def update_notation
    return unless self.has_attribute?(:notation)

    notation_sum   = 0
    notation_count = 0
    self.comment_threads.each do |comment|
      next if !comment.rating || comment.rating.zero?

      notation_sum   += comment.rating
      notation_count += 1
    end

    if notation_sum.zero?
      self.update_attribute('notation', 0)
    elsif notation_count.positive?
      new_notation = notation_sum / notation_count
      self.update_attribute('notation', new_notation)
    end
  end
end
