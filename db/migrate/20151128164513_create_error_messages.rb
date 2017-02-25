class CreateErrorMessages < ActiveRecord::Migration[5.0]
  def change
    create_table :error_messages do |t|
      t.text    :class_name
      t.text    :message
      t.text    :trace
      t.text    :line_number
      t.text    :column_number
      t.text    :params
      t.text    :target_url
      t.text    :referer_url
      t.text    :user_agent
      t.string  :user_info
      t.string  :app_name
      t.string  :doc_root
      t.string  :ip
      t.integer :origin,          default: 0,   null: false

      t.timestamps
    end
  end
end
