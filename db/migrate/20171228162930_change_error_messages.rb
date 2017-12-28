class ChangeErrorMessages < ActiveRecord::Migration[5.1]
  def change
    add_column :error_messages, :request_format, :string
    add_column :error_messages, :app_version, :string
    add_column :error_messages, :user_id, :string
    add_column :error_messages, :user_pseudo, :string
    add_column :error_messages, :user_locale, :string
    add_column :error_messages, :bot_agent, :string
    add_column :error_messages, :os_agent, :string

    rename_column :error_messages, :ip, :user_ip

    remove_column :error_messages, :user_info, :string
  end
end
