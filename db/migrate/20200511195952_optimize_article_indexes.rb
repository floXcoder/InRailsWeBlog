class OptimizeArticleIndexes < ActiveRecord::Migration[6.0]
  def change
    add_index :articles, :visibility, where: 'deleted_at IS NULL'

    commit_db_transaction
    add_index :versions, [:item_id], algorithm: :concurrently
  end
end
