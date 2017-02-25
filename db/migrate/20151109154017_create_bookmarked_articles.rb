class CreateBookmarkedArticles < ActiveRecord::Migration[5.0]
  def change
    create_table :bookmarked_articles do |t|
      t.belongs_to  :user,     null: false, index: false
      t.belongs_to  :article,  null: false, index: false

      t.timestamps
    end

    add_index :bookmarked_articles, :user_id
    add_index :bookmarked_articles, :article_id
    add_index :bookmarked_articles, [:user_id, :article_id], unique: true
  end
end
