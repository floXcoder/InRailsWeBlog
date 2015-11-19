class CreateTagRelationships < ActiveRecord::Migration
  def change
    create_table :tag_relationships do |t|
      t.integer :parent_id, index: true
      t.integer :child_id,  index: true

      t.text    :article_ids, null: false

      t.timestamps null: false
    end

    add_index :tag_relationships, [:parent_id, :child_id], unique: true
  end
end
