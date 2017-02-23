class CreateOutdatedArticles < ActiveRecord::Migration[5.0]
  def change
    create_table :outdated_articles do |t|
      t.references :article,          null: false
      t.references :user,             null: false

      t.timestamps null: false
    end

    add_index :outdated_articles, :article_id
    add_index :outdated_articles, :user_id
    add_index :outdated_articles, [:article_id, :user_id], unique: true
  end
end
