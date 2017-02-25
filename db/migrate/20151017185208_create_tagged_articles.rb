class CreateTaggedArticles < ActiveRecord::Migration[5.0]
  def change
    create_table :tagged_articles do |t|
      t.belongs_to  :article,  null: false, index: false
      t.belongs_to  :tag,      null: false, index: false

      t.boolean    :parent,    null: false, default: false
      t.boolean    :child,     null: false, default: false

      t.timestamps
    end

    add_index :tagged_articles, :article_id
    add_index :tagged_articles, :tag_id
    add_index :tagged_articles, [:article_id, :tag_id], unique: true
  end
end
