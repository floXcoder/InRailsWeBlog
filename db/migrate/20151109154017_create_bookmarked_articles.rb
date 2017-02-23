class CreateBookmarkedArticles < ActiveRecord::Migration[5.0]
  def change
    create_table :bookmarked_articles do |t|
      t.belongs_to :user
      t.belongs_to :article

      t.timestamps null: false
    end

    add_index :bookmarked_articles, :user_id
    add_index :bookmarked_articles, :article_id
    add_index :bookmarked_articles, [:user_id, :article_id], unique: true
  end
end
