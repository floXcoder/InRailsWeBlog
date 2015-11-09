class BookmarkedArticles < ActiveRecord::Migration
  def change
    create_table :bookmarked_articles do |t|
      t.belongs_to :user,     index: true
      t.belongs_to :article,  index: true

      t.timestamps null: false
    end

    add_index :bookmarked_articles, [:user_id, :article_id], unique: true
  end
end
