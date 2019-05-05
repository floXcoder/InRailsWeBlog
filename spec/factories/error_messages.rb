# frozen_string_literal: true

# == Schema Information
#
# Table name: error_messages
#
#  id             :bigint           not null, primary key
#  origin         :integer          default("server"), not null
#  class_name     :text
#  message        :text
#  trace          :text
#  line_number    :text
#  column_number  :text
#  params         :text
#  target_url     :text
#  referer_url    :text
#  user_agent     :text
#  request_format :string
#  app_name       :string
#  app_version    :string
#  doc_root       :string
#  user_id        :string
#  user_pseudo    :string
#  user_locale    :string
#  user_ip        :string
#  bot_agent      :string
#  os_agent       :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryBot.define do

  factory :error_message do
  end

end
