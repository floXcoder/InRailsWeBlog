class CreateShares < ActiveRecord::Migration[5.2]
  def change
    create_table :shares do |t|
      t.belongs_to  :user,              null: false, index: false

      t.references  :shareable, polymorphic: true, null: false, index: false

      t.belongs_to  :contributor,       index: false

      t.integer     :mode,              null: false, default: 0

      t.string      :public_link

      t.timestamps
    end

    add_foreign_key :shares, :users

    add_index :shares, :user_id
    add_index :shares, :contributor_id
    add_index :shares, [:shareable_id, :shareable_type]
    add_index :shares, [:user_id, :shareable_id, :shareable_type], name: 'index_user_and_shares_uniqueness', unique: true
  end
end
