# == Schema Information
#
# Table name: tagged_topics
#
#  id         :integer          not null, primary key
#  topic_id   :integer          not null
#  user_id    :integer          not null
#  tag_id     :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do

  factory :tagged_topic do
    # tag
    # topic
  end

end
