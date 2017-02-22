class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.references  :tagger,      null: false

      t.string      :name,        null: false
      t.text        :description
      t.string      :synonyms,                   default: [],   array: true
      t.string      :color

      t.integer     :priority,    null: false,   default: 0
      t.integer     :visibility,  null: false,   default: 0
      t.boolean     :archived,    null: false,   default: false
      t.boolean     :accepted,    null: false,   default: true

      t.integer     :tagged_articles_count,      default: 0

      t.string      :slug

      t.datetime    :deleted_at

      t.timestamps null: false
    end

    add_index :tags, :tagger_id,  where: 'deleted_at IS NULL'
    add_index :tags, :slug,       where: 'deleted_at IS NULL', unique: true
    add_index :tags, :name,               where: 'VISIBILITY = 0', unique: true
    add_index :tags, [:name, :tagger_id], where: 'VISIBILITY = 1', unique: true
  end
end
