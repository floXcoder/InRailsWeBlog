# == Schema Information
#
# Table name: error_messages
#
#  id            :integer          not null, primary key
#  class_name    :text
#  message       :text
#  trace         :text
#  line_number   :text
#  column_number :text
#  params        :text
#  target_url    :text
#  referer_url   :text
#  user_agent    :text
#  user_info     :string
#  app_name      :string
#  doc_root      :string
#  ip            :string
#  origin        :integer          default(0), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class ErrorMessageSerializer < ActiveModel::Serializer
  cache key: 'error', expires_in: 12.hours

  attributes :id,
             :class_name,
             :message,
             :trace,
             :line_number,
             :column_number,
             :params,
             :target_url,
             :user_agent,
             :user_info,
             :ip,
             :origin,
             :occurred_at

  def occurred_at
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end
end
