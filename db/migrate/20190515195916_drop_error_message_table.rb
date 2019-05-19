class DropErrorMessageTable < ActiveRecord::Migration[5.2]
  def up
    drop_table :error_messages
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
