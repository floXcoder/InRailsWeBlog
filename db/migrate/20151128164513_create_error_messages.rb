class CreateErrorMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :error_messages do |t|
      t.integer :origin,          default: 0,   null: false

      t.text    :class_name
      t.text    :message
      t.text    :trace
      t.text    :line_number
      t.text    :column_number
      t.text    :params
      t.text    :target_url
      t.text    :referer_url
      t.text    :user_agent
      t.string  :request_format
      t.string  :app_name
      t.string  :app_version
      t.string  :doc_root
      t.string  :user_id
      t.string  :user_pseudo
      t.string  :user_locale
      t.string  :user_ip
      t.string  :bot_agent
      t.string  :os_agent

      t.timestamps
    end
  end
end
