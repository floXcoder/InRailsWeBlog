class CreateTags < ActiveRecord::Migration[5.0]
  def change
    create_table :tags do |t|
      t.belongs_to  :user, foreign_key: true,    null: true,  index: false

      t.string      :name,        null: false
      t.text        :description
      t.string      :synonyms,                   default: [],   array: true
      t.string      :color

      t.integer     :notation,                   default: 0
      t.integer     :priority,                   default: 0

      t.integer     :visibility,  null: false,   default: 0
      t.boolean     :accepted,    null: false,   default: true
      t.boolean     :archived,    null: false,   default: false

      t.integer     :pictures_count,             default: 0
      t.integer     :tagged_articles_count,      default: 0
      t.integer     :bookmarks_count,            default: 0

      t.string      :slug

      t.datetime    :deleted_at,  index: true

      t.timestamps
    end

    add_index :tags, [:user_id, :visibility],     where: 'deleted_at IS NULL'
    add_index :tags, :slug,                       where: 'deleted_at IS NULL', unique: true
  end
end
