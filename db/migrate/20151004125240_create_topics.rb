class CreateTopics < ActiveRecord::Migration[5.0]
  def change
    create_table :topics do |t|
      t.belongs_to  :user,          null: true,     index: false

      t.string      :name,          null: false
      t.text        :description
      t.string      :color

      t.integer     :priority,      null: false,    default: 0
      t.integer     :visibility,    null: false,    default: 0
      t.boolean     :accepted,      null: false,    default: true
      t.boolean     :archived,      null: false,    default: false

      t.integer     :pictures_count,                default: 0
      t.integer     :articles_count,                default: 0
      t.integer     :bookmarks_count,               default: 0

      t.string      :slug

      t.datetime    :deleted_at,    index: true

      t.timestamps
    end

    add_foreign_key :topics, :users

    add_index :topics, :user_id,          where: 'deleted_at IS NULL'
    add_index :topics, :slug,             where: 'deleted_at IS NULL', unique: true
    add_index :topics, [:name, :user_id], unique: true
  end
end
