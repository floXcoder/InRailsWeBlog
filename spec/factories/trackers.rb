# frozen_string_literal: true

# == Schema Information
#
# Table name: trackers
#
#  id             :bigint           not null, primary key
#  tracked_type   :string           not null
#  tracked_id     :bigint           not null
#  views_count    :integer          default(0), not null
#  queries_count  :integer          default(0), not null
#  searches_count :integer          default(0), not null
#  clicks_count   :integer          default(0), not null
#  popularity     :integer          default(0), not null
#  rank           :integer          default(0), not null
#  home_page      :boolean          default(FALSE), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryBot.define do

  factory :tracker do
    views_count     { Random.rand(20..500) }
    queries_count   { Random.rand(20..500) }
    searches_count  { Random.rand(20..500) }
    clicks_count    { Random.rand(20..500) }
    # rank            { Random.rand(0..100) }
    # popularity      { Random.rand(0..100) }
    home_page       { false }
  end

end
