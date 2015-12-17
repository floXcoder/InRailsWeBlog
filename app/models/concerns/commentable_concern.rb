module CommentableConcern
  extend ActiveSupport::Concern

  included do
    acts_as_commentable
  end

  def comments
    self.comment_threads
  end

  def new_comment(comment)
    self.add_comment(comment)

    self.update_notation
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
        notation_sum += comment.rating
        notation_count += 1
      end

      if notation_count > 0
        self.notation = notation_sum / notation_count
        self.save
      end
    end
  end

  class_methods do
  end
end
