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

class TrackerSerializer < ActiveModel::Serializer
  cache key: 'tracker', expires_in: 12.hours

  attributes :views_count,
             :queries_count,
             :searches_count,
             :comments_count,
             :clicks_count,
             :bookmarks_count
end
