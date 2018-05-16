# == Schema Information
#
# Table name: error_messages
#
#  id             :bigint(8)        not null, primary key
#  class_name     :text
#  message        :text
#  trace          :text
#  line_number    :text
#  column_number  :text
#  params         :text
#  target_url     :text
#  referer_url    :text
#  user_agent     :text
#  app_name       :string
#  doc_root       :string
#  user_ip        :string
#  origin         :integer          default("server"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  request_format :string
#  app_version    :string
#  user_id        :string
#  user_pseudo    :string
#  user_locale    :string
#  bot_agent      :string
#  os_agent       :string
#

FactoryBot.define do

  factory :error_message do
  end

end
