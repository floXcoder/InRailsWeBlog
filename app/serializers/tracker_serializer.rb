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
#  visits_count   :integer          default(0), not null
#
class TrackerSerializer
  include FastJsonapi::ObjectSerializer

  set_key_transform :camel_lower

  attributes :views_count,
             :queries_count,
             :searches_count,
             :visits_count,
             :clicks_count,
             :popularity,
             :rank,
             :home_page
end
