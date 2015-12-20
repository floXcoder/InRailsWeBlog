class CreateTrackers < ActiveRecord::Migration
  def change
    create_table :trackers do |t|
      t.references :tracked, polymorphic: true, null: false, index: true

      t.integer :views_count,      default: 0,  null: false
      t.integer :queries_count,    default: 0,  null: false
      t.integer :searches_count,   default: 0,  null: false
      t.integer :comments_count,   default: 0,  null: false
      t.integer :clicks_count,     default: 0,  null: false
      t.integer :bookmarks_count,  default: 0,  null: false

      t.timestamps null: false
    end
  end
end
