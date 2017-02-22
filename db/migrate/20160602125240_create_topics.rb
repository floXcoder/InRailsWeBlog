class CreateTopics < ActiveRecord::Migration
  def change
    create_table :topics do |t|
      t.references  :user,        null: false

      t.string      :name,        null: false
      t.text        :description
      t.string      :color

      t.integer     :priority,    null: false,   default: 0
      t.integer     :visibility,  null: false,   default: 0
      t.boolean     :archived,    null: false,   default: false
      t.boolean     :accepted,    null: false,   default: true

      t.string      :slug

      t.datetime    :deleted_at

      t.timestamps null: false
    end

    add_index :topics, :user_id,          where: 'deleted_at IS NULL'
    add_index :topics, :slug,             where: 'deleted_at IS NULL', unique: true
    add_index :topics, [:name, :user_id], unique: true
  end
end
