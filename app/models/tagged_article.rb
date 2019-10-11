# frozen_string_literal: true
# == Schema Information
#
# Table name: tagged_articles
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  topic_id   :bigint           not null
#  tag_id     :bigint           not null
#  article_id :bigint           not null
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
  tracked owner: proc { |_controller, model| model.article&.user }, recipient: :article, parameters: :tag

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user
  belongs_to :topic

  belongs_to :article,
             touch: true

  belongs_to :tag,
             autosave:      true,
             counter_cache: true,
             touch:         true

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

  validate :relationship_authorisation

  # == Scopes ===============================================================

  # == Callbacks ============================================================
  after_commit :invalidate_tag_cache

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

  private

  def relationship_authorisation
    return unless self.tag.present? && self.article.present?

    if self.tag.only_me?
      if self.tag.user_id != self.user_id
        errors.add(:base, I18n.t('activerecord.errors.models.tagged_article.incorrect_tag_affiliation'))
      end

      if self.article.topic_id != self.topic_id
        errors.add(:base, I18n.t('activerecord.errors.models.tagged_article.incorrect_topic_affiliation'))
      end
    end
  end

  def invalidate_tag_cache
    Rails.cache.delete("user_tags:#{self.user_id}_and_#{self.topic_id}")
  end

end
