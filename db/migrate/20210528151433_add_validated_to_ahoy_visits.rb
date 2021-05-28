class AddValidatedToAhoyVisits < ActiveRecord::Migration[6.1]
  def change
    add_column :ahoy_visits, :validated, :boolean, default: false, null: false
  end
end
