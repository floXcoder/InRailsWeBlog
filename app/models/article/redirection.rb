# frozen_string_literal: true

# == Schema Information
#
# Table name: article_redirections
#
#  id            :bigint           not null, primary key
#  article_id    :bigint           not null
#  previous_slug :string           not null
#  current_slug  :string           not null
#  locale        :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
class Article::Redirection < ApplicationRecord

  # == Attributes ===========================================================
  # Strip whitespaces
  auto_strip_attributes :previous_slug, :current_slug

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :article

  # == Validations ==========================================================
  validates :article,
            presence: true

  validates :previous_slug,
            presence: true

  validates :current_slug,
            presence: true

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
