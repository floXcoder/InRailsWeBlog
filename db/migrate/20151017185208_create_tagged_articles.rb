class CreateTaggedArticles < ActiveRecord::Migration
  def change
    create_table :tagged_articles do |t|
      t.references :article,        null: false
      t.references :tag,            null: false

      t.boolean    :parent,         null: false,    default: false
      t.boolean    :child,          null: false,    default: false

      t.timestamps null: false
    end

    add_index :tagged_articles, :article_id
    add_index :tagged_articles, :tag_id
    add_index :tagged_articles, [:article_id, :tag_id], unique: true
  end
end
