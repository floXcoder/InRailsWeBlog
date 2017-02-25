class CreateTaggedTopics < ActiveRecord::Migration[5.0]
  def change
    create_table :tagged_topics do |t|
      t.belongs_to  :user,     null: false, index: false

      t.belongs_to  :article,  null: false, index: false
      t.belongs_to  :tag,      null: false, index: false

      t.timestamps
    end

    add_index :tagged_topics, :topic_id
    add_index :tagged_topics, :tag_id
    add_index :tagged_topics, :user_id
    add_index :tagged_topics, [:topic_id, :user_id, :tag_id], unique: true
  end
end
