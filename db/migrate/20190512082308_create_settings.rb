class CreateSettings < ActiveRecord::Migration[5.2]
  def change
    create_table :settings do |t|
      t.string  :name,       null: false
      t.text    :value,      null: true

      t.integer :value_type, null: false, default: 0

      t.timestamps
    end

    add_index :settings, [:name, :value], unique: true
  end
end
