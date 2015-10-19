class CreateArticles < ActiveRecord::Migration
  def up
    create_table :articles do |t|
      t.references  :author,                          null: false,    index: true
      t.integer     :visibility,      default: 0,     null: false
      t.integer     :notation,        default: 0
      t.integer     :priority,        default: 0
      t.boolean     :allow_comment,   default: false, null: false
      t.boolean     :private_content, default: false, null: false
      t.string      :slug

      t.timestamps null: false
    end

    Article.create_translation_table! title:   { type: :string, default: ''              },
                                      summary: { type: :text,   default: ''              },
                                      content: { type: :text,   default: '', null: false }

    add_index :articles, :slug, unique: true
  end

  def down
    drop_table :articles
    Article.drop_translation_table!
  end
end
