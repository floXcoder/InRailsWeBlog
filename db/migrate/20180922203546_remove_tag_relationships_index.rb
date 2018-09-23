class RemoveTagRelationshipsIndex < ActiveRecord::Migration[5.2]
  def change
    remove_index :tag_relationships, name: 'index_tag_relationship_uniqueness'
  end
end
