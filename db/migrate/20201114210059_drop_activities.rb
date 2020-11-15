class DropActivities < ActiveRecord::Migration[6.0]
  def up
    drop_table :activities
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
