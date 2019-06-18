class AddInventoriesToArticles < ActiveRecord::Migration[5.2]
  def change
    add_column :articles, :inventories, :jsonb, default: {}, null: false
  end
end
