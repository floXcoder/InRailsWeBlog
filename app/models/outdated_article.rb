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
  belongs_to :article,
             counter_cache: true
  belongs_to :user

  # == Validations ==========================================================
  validates :article,
            presence: true
  validates :user,
            presence: true

  validates_uniqueness_of :article_id,
                          scope: :user_id,
                          allow_nil: true,
                          message: I18n.t('activerecord.errors.models.outdated_article.already_outdated')

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
