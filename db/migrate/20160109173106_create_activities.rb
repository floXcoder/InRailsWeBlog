# Migration responsible for creating a table with activities
class CreateActivities < ActiveRecord::Migration[5.0]
  def change
    create_table :activities do |t|
      t.belongs_to  :trackable,    polymorphic: true
      t.belongs_to  :owner,        polymorphic: true
      t.string      :key
      t.text        :parameters
      t.belongs_to  :recipient,    polymorphic: true

      t.timestamps null: false
    end

    add_index :activities, [:trackable_id, :trackable_type], order: { created_at: 'DESC' }
    add_index :activities, [:owner_id, :owner_type], order: { created_at: 'DESC' }
    add_index :activities, [:recipient_id, :recipient_type], order: { created_at: 'DESC' }
  end
end
