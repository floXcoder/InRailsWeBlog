class CreateTaggedTopics < ActiveRecord::Migration[5.0]
  def change
    create_table :tagged_topics do |t|
      t.references :topic,      null: false
      t.references :user,       null: false
      t.references :tag,        null: false

      t.timestamps null: false
    end

    add_index :tagged_topics, :topic_id
    add_index :tagged_topics, :tag_id
    add_index :tagged_topics, :user_id
    add_index :tagged_topics, [:topic_id, :user_id, :tag_id], unique: true
  end
end
