class ThumbsUpMigration < ActiveRecord::Migration[5.1]
  def change
    create_table :votes, force: true do |t|
      t.references  :voteable,  polymorphic: true,  null: false
      t.references  :voter,     polymorphic: true

      t.boolean     :vote,      null: false,        default: false

      t.timestamps
    end

    add_index :votes, [:voter_id, :voter_type]
    add_index :votes, [:voteable_id, :voteable_type]

    # Comment out the line below to allow multiple votes per voter on a single entity.
    add_index :votes, [:voter_id, :voter_type, :voteable_id, :voteable_type], unique: true, name: 'fk_one_vote_per_user_per_entity'
  end
end
