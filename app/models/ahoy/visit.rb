# frozen_string_literal: true

class Ahoy::Visit < ApplicationRecord

  # == Attributes ===========================================================
  self.table_name = 'ahoy_visits'

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :user,
             optional: true

  has_many :events,
           class_name: 'Ahoy::Event'

  has_many :articles

  # == Validations ==========================================================

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
