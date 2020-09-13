class ActsAsCommentableWithThreadingMigration < ActiveRecord::Migration[5.1]
  def change
    create_table :comments, force: true do |t|
      t.belongs_to  :user,                                 null: false, index: false

      t.references  :commentable,    polymorphic: true,    null: false, index: false

      t.string      :title
      t.string      :subject
      t.text        :body
      t.integer     :rating,            default: 0
      t.integer     :positive_reviews,  default: 0
      t.integer     :negative_reviews,  default: 0

      t.boolean     :accepted,          default: true,     null: false
      t.boolean     :ask_for_deletion,  default: false,    null: false

      t.datetime    :deleted_at

      # Act as nested
      t.integer     :parent_id,                                          index: true
      t.integer     :lft
      t.integer     :rgt

      t.timestamps null: false
    end

    add_foreign_key :comments, :users

    add_index :comments, :user_id,  where: 'deleted_at IS NULL'
    add_index :comments, [:commentable_id, :commentable_type], where: 'deleted_at IS NULL', order: { created_at: 'ASC' }
  end
end
