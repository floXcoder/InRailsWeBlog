class CreateTrackers < ActiveRecord::Migration[5.1]
  def change
    create_table :trackers do |t|
      t.references  :tracked,         polymorphic: true, null: false, index: false

      t.integer     :views_count,     default: 0,        null: false
      t.integer     :queries_count,   default: 0,        null: false
      t.integer     :searches_count,  default: 0,        null: false
      t.integer     :clicks_count,    default: 0,        null: false

      t.integer     :popularity,      default: 0,        null: false
      t.integer     :rank,            default: 0,        null: false
      t.boolean     :home_page,       default: false,    null: false

      t.timestamps
    end

    add_index :trackers, [:tracked_id, :tracked_type]
  end
end
