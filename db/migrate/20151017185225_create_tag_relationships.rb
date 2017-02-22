class CreateTagRelationships < ActiveRecord::Migration
  def change
    create_table :tag_relationships do |t|
      t.references  :parent,        null: false
      t.references  :child,         null: false

      t.string      :article_ids,   null: false,  array: true

      t.timestamps null: false
    end

    add_index :tag_relationships, [:parent_id, :child_id], unique: true
  end
end
