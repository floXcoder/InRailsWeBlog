# frozen_string_literal: true

# == Schema Information
#
# Table name: ahoy_events
#
#  id         :bigint           not null, primary key
#  visit_id   :bigint
#  user_id    :bigint
#  name       :string
#  properties :jsonb
#  time       :datetime
#
class Ahoy::Event < ApplicationRecord

  # == Attributes ===========================================================
  include Ahoy::QueryMethods

  self.table_name = 'ahoy_events'

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :visit,
             class_name:    'Ahoy::Visit',
             counter_cache: true

  belongs_to :user,
             optional: true

  # == Validations ==========================================================

  # == Scopes ===============================================================
  scope :recent_articles, -> (limit) {
    where(name: 'page_visit')
      .where("(properties->'article_id') is not null")
      .order('time DESC')
      .limit(limit)
  }

  scope :recent_tags, -> (limit) {
    where(name: 'page_visit')
      .where("(properties->'tag_id') is not null")
      .order('time DESC')
      .limit(limit)
  }

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
