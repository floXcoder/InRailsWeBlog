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

class TaggedTopic < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :topic
  belongs_to :user
  belongs_to :tag

  # == Validations ==========================================================
  validates :topic,
            presence: true
  validates :user,
            presence: true
  validates :tag,
            presence: true

  validates_uniqueness_of :user_id, scope: [:tag_id, :topic_id], allow_nil: true

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
