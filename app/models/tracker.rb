# frozen_string_literal: true
# == Schema Information
#
# Table name: trackers
#
#  id             :integer          not null, primary key
#  tracked_type   :string           not null
#  tracked_id     :integer          not null
#  views_count    :integer          default("0"), not null
#  queries_count  :integer          default("0"), not null
#  searches_count :integer          default("0"), not null
#  clicks_count   :integer          default("0"), not null
#  popularity     :integer          default("0"), not null
#  rank           :integer          default("0"), not null
#  home_page      :boolean          default("false"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class Tracker < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :tracked,
             polymorphic: true,
             touch:       true

  # == Validations ==========================================================

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
