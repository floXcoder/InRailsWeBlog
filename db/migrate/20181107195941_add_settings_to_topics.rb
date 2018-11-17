class AddSettingsToTopics < ActiveRecord::Migration[5.2]
  def change
    add_column :topics, :settings, :jsonb, default: {}, null: false
  end
end
