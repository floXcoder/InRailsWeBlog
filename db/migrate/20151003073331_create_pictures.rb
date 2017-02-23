class CreatePictures < ActiveRecord::Migration[5.0]
  def change
    create_table :pictures do |t|
      t.references  :imageable,   polymorphic: true, null: false
      t.string      :image
      t.string      :image_tmp

      t.text        :description
      t.string      :copyright

      t.integer     :priority,    default: 0,        null: false

      t.boolean     :accepted,    default: true,     null: false

      t.datetime    :deleted_at,                                    index: true

      t.timestamps null: false
    end

    add_index :pictures, [:imageable_id, :imageable_type], where: 'deleted_at IS NULL'
  end
end
