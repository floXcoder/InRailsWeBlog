class CreateTags < ActiveRecord::Migration
  def up
    create_table :tags do |t|
      t.references :tagger, null: false, index: true
      t.string  :name, null: false, unique: true, index: true
      t.string  :slug

      t.timestamps null: false
    end

    add_index :tags, :slug, unique: true
  end

  def down
    drop_table :tags
  end
end
