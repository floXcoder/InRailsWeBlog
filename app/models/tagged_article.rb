# == Schema Information
#
# Table name: tagged_articles
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  topic_id   :integer          not null
#  tag_id     :integer          not null
#  article_id :integer          not null
#  parent     :boolean          default(FALSE), not null
#  child      :boolean          default(FALSE), not null
#  deleted_at :datetime
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
             autosave:      true,
             counter_cache: true

  # == Validations ==========================================================
  validates :user,
            presence: true
  validates :topic,
            presence: true

  validates :article,
            presence: true
  # , on:       :update

  validates :tag,
            presence: true
  # , on:       :update

  validates_uniqueness_of :article_id,
                          scope:     :tag_id,
                          allow_nil: true,
                          message:   I18n.t('activerecord.errors.models.tagged_article.already_tagged')

  validate :tag_authorized

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

  private

  def tag_authorized
    if self.tag.only_me? && self.tag.user_id != self.user_id
      # Useful? : tag do not belong to a specific topic
      # || (self.tag.only_me? && self.article.topic_id != self.topic_id)
      errors.add(:base, I18n.t('activerecord.errors.models.tagged_article.tag_not_authorized'))
    end
  end

end
