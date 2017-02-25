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

FactoryGirl.define do

  factory :error_message do

  end

end
