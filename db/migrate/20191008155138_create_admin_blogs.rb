class CreateAdminBlogs < ActiveRecord::Migration[5.2]
  def change
    create_table :admin_blogs do |t|
      t.belongs_to  :admin, foreign_key: true,  null: false, index: false

      t.integer     :visibility,                null: false, default: 0

      t.string      :title,                     null: false

      t.text        :content,                   null: false

      t.timestamps
    end

    add_index :admin_blogs, [:admin_id]
    add_index :admin_blogs, [:admin_id, :visibility]
  end
end
