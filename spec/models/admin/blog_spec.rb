# == Schema Information
#
# Table name: admin_blogs
#
#  id         :bigint           not null, primary key
#  admin_id   :bigint           not null
#  visibility :integer          default("everyone"), not null
#  title      :string           not null
#  content    :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe Admin::Blog, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
