# frozen_string_literal: true
# == Schema Information
#
# Table name: article_relationships
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  parent_id  :bigint           not null
#  child_id   :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Article::Relationship < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :user

  belongs_to :parent,
             class_name:  'Article',
             foreign_key: 'parent_id'
  belongs_to :child,
             class_name:  'Article',
             foreign_key: 'child_id'

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :parent,
            presence: true,
            on:       :update
  validates :child,
            presence: true,
            on:       :update

  validates_uniqueness_of :parent_id,
                          scope:     [:user_id, :child_id],
                          allow_nil: true,
                          message:   I18n.t('activerecord.errors.models.article_relationship.already_linked')

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
