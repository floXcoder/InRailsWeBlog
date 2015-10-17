class CreateTaggedArticles < ActiveRecord::Migration
  def change
    create_table :tagged_articles do |t|
      t.belongs_to :article,  index: true
      t.belongs_to :tag,      index: true

      t.boolean    :parent,         default: false,   null: false
      t.boolean    :child,          default: false,   null: false

      t.timestamps null: false
    end

    add_index :tagged_articles, [:article_id, :tag_id], unique: true
  end
end
