class ActsAsCommentableWithThreadingMigration < ActiveRecord::Migration
  def self.up
    create_table :comments, force: true do |t|
      t.integer   :commentable_id,    null: false
      t.string    :commentable_type,  null: false
      t.integer   :user_id,           null: false
      t.string    :title
      t.text      :body
      t.string    :subject
      t.integer   :rating,            default: 0
      t.integer   :positive_reviews,  default: 0
      t.integer   :negative_reviews,  default: 0

      # Act as nested
      t.integer   :parent_id
      t.integer   :lft
      t.integer   :rgt
      t.timestamps
    end

    add_index :comments, :user_id
    add_index :comments, [:commentable_id, :commentable_type]
  end

  def self.down
    drop_table :comments
  end
end
