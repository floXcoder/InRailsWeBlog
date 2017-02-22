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

require 'rails_helper'

RSpec.describe TaggedTopic, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
