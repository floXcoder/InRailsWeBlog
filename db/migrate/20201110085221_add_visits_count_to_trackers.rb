class AddVisitsCountToTrackers < ActiveRecord::Migration[6.0]
  def change
    add_column :trackers, :visits_count, :integer, default: 0, null: false
  end
end
