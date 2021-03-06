class CreateArticles < ActiveRecord::Migration[5.1]
  def change
    create_table :articles do |t|
      t.belongs_to  :user,            null: true,     index: false
      t.belongs_to  :topic,           null: true,     index: false

      t.integer     :mode,            null: false,    default: 0

      # Translations
      t.jsonb       :title_translations,                     default: {}
      t.jsonb       :summary_translations,                   default: {}
      t.jsonb       :content_translations,   null: false,    default: {}
      t.string      :languages,              null: false,    default: [], array: true

      t.text        :reference

      t.boolean     :draft,           null: false,    default: false
      t.integer     :notation,                        default: 0
      t.integer     :priority,                        default: 0

      t.integer     :visibility,      null: false,    default: 0
      t.boolean     :accepted,        null: false,    default: true
      t.boolean     :archived,        null: false,    default: false
      t.boolean     :allow_comment,   null: false,    default: true

      t.integer     :pictures_count,                  default: 0
      t.integer     :outdated_articles_count,         default: 0
      t.integer     :bookmarks_count,                 default: 0
      t.integer     :comments_count,                  default: 0

      t.string      :slug

      t.datetime    :deleted_at,      index: true

      t.timestamps
    end

    add_foreign_key :articles, :users
    add_foreign_key :articles, :topics

    add_index :articles, [:user_id,   :visibility],  where: 'deleted_at IS NULL'
    add_index :articles, [:topic_id,  :visibility],  where: 'deleted_at IS NULL'
    add_index :articles, :slug,                      where: 'deleted_at IS NULL', unique: true
  end
end
