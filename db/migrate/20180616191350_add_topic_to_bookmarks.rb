class AddTopicToBookmarks < ActiveRecord::Migration[5.2]
  def change
    add_reference :bookmarks, :topic
  end
end
