class CreateTags < ActiveRecord::Migration
  def up
    create_table :tags do |t|
      t.string  :name, null: false, unique: true, index: true

      t.timestamps null: false
    end

    create_table :articles_tags, id: false do |t|
      t.belongs_to :article,  index: true
      t.belongs_to :tag,  index: true
    end
  end

  def down
    drop_table :tags

    drop_table :articles_tags
  end
end
