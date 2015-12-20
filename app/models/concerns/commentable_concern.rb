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
    if new_comment_attributes[:rating] && new_comment_attributes[:rating].blank?
      new_comment_attributes.delete(:rating)
    end

    comment_updated = comment.update_attributes(new_comment_attributes)

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

  def comments_tree
    self.root_comments.includes(:user).order('comments.created_at ASC').map do |root_comment|
      root_comment.self_and_descendants
    end
  end

  def update_notation
    if self.has_attribute?(:notation)
      notation_sum = 0
      notation_count = 0
      self.comment_threads.each do |comment|
        next if !comment.rating || comment.rating == 0
        notation_sum += comment.rating
        notation_count += 1
      end

      if notation_sum == 0
        self.update_attribute('notation', 0)
      elsif notation_count > 0
        new_notation = notation_sum / notation_count
        self.update_attribute('notation', new_notation)
      end
    end
  end

  class_methods do
  end
end
