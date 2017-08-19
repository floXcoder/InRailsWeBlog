class CreateTaggedArticles < ActiveRecord::Migration[5.1]
  def change
    create_table :tagged_articles do |t|
      t.belongs_to  :user,        null: false,  index: false
      t.belongs_to  :topic,       null: false,  index: false

      t.belongs_to  :tag,         null: false,  index: false
      t.belongs_to  :article,     null: false,  index: false

      t.boolean     :parent,      null: false,  default: false
      t.boolean     :child,       null: false,  default: false

      t.datetime    :deleted_at,  index: true

      t.timestamps
    end

    add_foreign_key :tagged_articles, :users
    add_foreign_key :tagged_articles, :topics
    add_foreign_key :tagged_articles, :tags
    add_foreign_key :tagged_articles, :articles

    add_index :tagged_articles, :article_id, where: 'deleted_at IS NULL'
    add_index :tagged_articles, :tag_id, where: 'deleted_at IS NULL'
    add_index :tagged_articles, :user_id, where: 'deleted_at IS NULL'
    add_index :tagged_articles, :topic_id, where: 'deleted_at IS NULL'
    add_index :tagged_articles, [:article_id, :tag_id], where: 'deleted_at IS NULL', unique: true
  end
end
