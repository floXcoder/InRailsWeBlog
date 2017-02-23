# == Schema Information
#
# Table name: outdated_articles
#
#  id         :integer          not null, primary key
#  article_id :integer          not null
#  user_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class OutdatedArticle < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================
  include PublicActivity::Model
  tracked owner: :user, recipient: :article

  # == Relationships ========================================================
  belongs_to :article, counter_cache: true
  belongs_to :user

  # == Validations ==========================================================
  validates :article_id,
            presence: true
  validates :user_id,
            presence: true

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
