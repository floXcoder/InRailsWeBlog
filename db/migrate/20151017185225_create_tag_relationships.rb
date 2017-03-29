class CreateTagRelationships < ActiveRecord::Migration[5.0]
  def change
    create_table :tag_relationships do |t|
      t.belongs_to  :user,          null: false,  index: false
      t.belongs_to  :topic,         null: false,  index: false

      t.belongs_to  :article,       null: false,  index: false

      t.belongs_to  :parent,        null: false,  index: false
      t.belongs_to  :child,         null: false,  index: false

      t.datetime    :deleted_at,    index: true

      t.timestamps
    end

    add_foreign_key :tag_relationships, :users
    add_foreign_key :tag_relationships, :topics
    add_foreign_key :tag_relationships, :articles
    add_foreign_key :tag_relationships, :tags, column: :parent_id
    add_foreign_key :tag_relationships, :tags, column: :child_id

    add_index :tag_relationships, :user_id
    add_index :tag_relationships, [:topic_id, :parent_id, :child_id], name: 'index_tag_relationship_uniqueness', unique: true
  end
end
