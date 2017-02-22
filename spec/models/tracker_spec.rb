# == Schema Information
#
# Table name: trackers
#
#  id              :integer          not null, primary key
#  tracked_id      :integer          not null
#  tracked_type    :string           not null
#  views_count     :integer          default(0), not null
#  queries_count   :integer          default(0), not null
#  searches_count  :integer          default(0), not null
#  comments_count  :integer          default(0), not null
#  clicks_count    :integer          default(0), not null
#  bookmarks_count :integer          default(0), not null
#  rank            :integer          default(0), not null
#  home_page       :boolean          default(FALSE), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

require 'rails_helper'

RSpec.describe Tracker, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
