class AddModeToTopics < ActiveRecord::Migration[5.2]
  def change
    add_column :topics, :mode, :integer, default: 0, null: false
  end
end
