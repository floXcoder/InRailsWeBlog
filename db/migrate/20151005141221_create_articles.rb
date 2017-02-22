class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.references  :author,          null: false
      t.references  :topic,           null: false

      t.string      :title,                           default: ''
      t.text        :summary,                         default: ''
      t.text        :content,         null: false,    default: ''
      t.boolean     :private_content, null: false,    default: false
      t.boolean     :is_link,         null: false,    default: false
      t.text        :reference
      t.boolean     :temporary,       null: false,    default: false
      t.string      :language
      t.boolean     :allow_comment,   null: false,    default: true
      t.integer     :notation,                        default: 0
      t.integer     :priority,                        default: 0
      t.integer     :visibility,      null: false,    default: 0

      t.boolean     :archived,        null: false,    default: false
      t.boolean     :accepted,        null: false,    default: true

      t.integer     :bookmarked_articles_count,       default: 0
      t.integer     :outdated_articles_count,         default: 0

      t.string      :slug

      t.datetime    :deleted_at

      t.timestamps null: false
    end

    add_index :articles, [:author_id, :visibility],   where: 'deleted_at IS NULL'
    add_index :articles, [:topic_id,  :visibility],   where: 'deleted_at IS NULL'
    add_index :articles, :slug,                       where: 'deleted_at IS NULL', unique: true
  end
end
