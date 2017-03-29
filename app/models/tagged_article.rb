# == Schema Information
#
# Table name: tagged_articles
#
#  id         :integer          not null, primary key
#  article_id :integer          not null
#  tag_id     :integer          not null
#  parent     :boolean          default(FALSE), not null
#  child      :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class TaggedArticle < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================
  # Follow public activities
  include PublicActivity::Model
  tracked owner: proc { |_controller, model| model.article.user }, recipient: :article, parameters: :tag

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user
  belongs_to :topic

  belongs_to :article

  belongs_to :tag,
             autosave: true,
             counter_cache: true

  # == Validations ==========================================================
  validates :user,
            presence: true
  validates :topic,
            presence: true

  validates :article,
            presence: true,
            on: :update

  validates :tag,
            presence: true,
            on: :update

  validates_uniqueness_of :article_id,
                          scope: :tag_id,
                          allow_nil: true,
                          message: I18n.t('activerecord.errors.models.tagged_article.already_tagged')

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
