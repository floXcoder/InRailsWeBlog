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

class ErrorMessageSerializer < ActiveModel::Serializer
  cache key: 'failure', expires_in: InRailsWeBlog.config.cache_time

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
