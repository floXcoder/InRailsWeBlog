class CreateTagRelationships < ActiveRecord::Migration[5.0]
  def change
    create_table :tag_relationships do |t|
      t.belongs_to  :user,          null: true,   index: false

      t.belongs_to  :parent,        null: false,  index: false
      t.belongs_to  :child,         null: false,  index: false

      t.string      :article_ids,   null: false,  array: true

      t.timestamps
    end

    add_index :tag_relationships, :user_id
    add_index :tag_relationships, [:user_id, :parent_id, :child_id], name: 'index_tag_relationship_uniqueness', unique: true
  end
end
