class CreatePictures < ActiveRecord::Migration[5.0]
  def change
    create_table :pictures do |t|
      t.belongs_to  :user,            null: false,  index: false
      t.integer     :imageable_id
      t.string      :imageable_type,  null: false

      t.string      :image
      t.string      :image_tmp

      t.text        :description
      t.string      :copyright

      t.integer     :priority,        null: false,  default: 0

      t.boolean     :accepted,        null: false,  default: true

      t.datetime    :deleted_at,                    index: true

      t.timestamps
    end

    add_index :pictures, :user_id,  where: 'deleted_at IS NULL'
    add_index :pictures, [:imageable_id, :imageable_type], where: 'deleted_at IS NULL'
  end
end
