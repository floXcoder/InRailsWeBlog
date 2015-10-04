class CreatePictures < ActiveRecord::Migration
  def change
    create_table :pictures do |t|

      t.references  :imageable,   null: false,  index: true,  polymorphic: true
      t.string      :image
      t.string      :image_tmp

      t.timestamps null: false
    end
  end
end
