class CreatePreferences < ActiveRecord::Migration
  def change
    create_table :preferences do |t|
      t.belongs_to  :user

      t.string      :name,  null: false, unique: true
      t.string      :value, null: false, unique: true

      t.timestamps null: false
    end

    add_index :preferences, :user_id
  end
end
