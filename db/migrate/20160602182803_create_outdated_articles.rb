class CreateOutdatedArticles < ActiveRecord::Migration[5.1]
  def change
    create_table :outdated_articles do |t|
      t.belongs_to  :user,     null: false, index: false
      t.belongs_to  :article,  null: false, index: false

      t.timestamps
    end

    add_foreign_key :outdated_articles, :users
    add_foreign_key :outdated_articles, :articles

    add_index :outdated_articles, :article_id
    add_index :outdated_articles, :user_id
    add_index :outdated_articles, [:article_id, :user_id], unique: true
  end
end
