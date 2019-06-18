class CreateTopicInventoryFields < ActiveRecord::Migration[5.2]
  def change
    create_table :topic_inventory_fields do |t|
      t.belongs_to  :topic,           null: true,     index: false

      t.string      :name,            null: false
      t.string      :field_name,      null: false

      t.integer     :value_type,      null: false,    default: 0

      t.string      :parent_category

      t.boolean     :required,        null: false,    default: false
      t.boolean     :searchable,      null: false,    default: false
      t.boolean     :filterable,      null: false,    default: false

      t.integer     :priority,        null: false,    default: 0
      t.integer     :visibility,      null: false,    default: 0

      t.datetime    :deleted_at,      index: true

      t.timestamps
    end

    add_foreign_key :topic_inventory_fields, :topics

    add_index :topic_inventory_fields, :topic_id,          where: 'deleted_at IS NULL'
    add_index :topic_inventory_fields, [:name, :topic_id], unique: true
  end
end
