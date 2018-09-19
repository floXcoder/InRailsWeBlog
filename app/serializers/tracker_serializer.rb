# frozen_string_literal: true

# == Schema Information
#
# Table name: trackers
#
#  id             :bigint(8)        not null, primary key
#  tracked_type   :string           not null
#  tracked_id     :bigint(8)        not null
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

class TrackerSerializer < ActiveModel::Serializer
  cache key: 'tracker', expires_in: CONFIG.cache_time

  attributes :views_count,
             :queries_count,
             :searches_count,
             :clicks_count
end
