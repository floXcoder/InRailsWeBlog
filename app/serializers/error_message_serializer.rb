# frozen_string_literal: true

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

class ErrorMessageSerializer < ActiveModel::Serializer
  cache key: 'failure', expires_in: CONFIG.cache_time

  attributes :id,
             :origin,
             :class_name,
             :message,
             :trace,
             :line_number,
             :column_number,
             :params,
             :target_url,
             :referer_url,
             :request_format,
             :user_id,
             :user_pseudo,
             :user_locale,
             :user_ip,
             :user_agent,
             :bot_agent,
             :os_agent,
             :app_version,
             :occurred_at

  def occurred_at
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end
end
