class ActsAsCommentableWithThreadingMigration < ActiveRecord::Migration[5.0]
  def change
    create_table :comments, force: true do |t|
      t.references  :commentable,       polymorphic: true,    null: false
      t.references  :user,                                    null: false

      t.string      :title
      t.text        :body
      t.string      :subject
      t.integer     :rating,            default: 0
      t.integer     :positive_reviews,  default: 0
      t.integer     :negative_reviews,  default: 0

      t.boolean     :accepted,          default: true,        null: false

      t.datetime    :deleted_at

      # Act as nested
      t.integer     :parent_id
      t.integer     :lft
      t.integer     :rgt

      t.timestamps null: false
    end

    add_index :comments, :user_id,    where: 'deleted_at IS NULL'
    add_index :comments, :parent_id,  where: 'deleted_at IS NULL'
    add_index :comments, [:commentable_id, :commentable_type], where: 'deleted_at IS NULL', order: { created_at: 'ASC' }
  end
end
