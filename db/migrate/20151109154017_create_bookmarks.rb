class CreateBookmarkedArticles < ActiveRecord::Migration[5.0]
  def change
    create_table :bookmarks do |t|
      t.belongs_to  :user,                          null: false, index: false
      t.references :bookmarked, polymorphic: true,  null: false, index: false

      t.boolean    :follow,     default: false

      t.timestamps
    end

    add_index :bookmarks, :user_id
    add_index :bookmarks, [:bookmarked_id, :bookmarked_type]
    add_index :bookmarks, [:user_id, :bookmarked_id, :bookmarked_type], name: 'index_user_and_bookmarks_uniqueness', unique: true
  end
end
