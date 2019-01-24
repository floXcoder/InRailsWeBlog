class ChangeTopicSlugIndex < ActiveRecord::Migration[5.2]
  def change
    remove_index :topics, column: :slug, unique: true

    add_index :topics, [:slug, :user_id], unique: true, where: 'deleted_at IS NULL'
  end
end
