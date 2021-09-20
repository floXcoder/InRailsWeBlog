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

class Tracker < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :tracked,
             polymorphic: true,
             touch:       true

  belongs_to :article,
             class_name:  'Article',
             foreign_key: 'tracked_id',
             optional:    true
  belongs_to :tag,
             class_name:  'Tag',
             foreign_key: 'tracked_id',
             optional:    true
  belongs_to :topic,
             class_name:  'Topic',
             foreign_key: 'tracked_id',
             optional:    true

  # == Validations ==========================================================

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
