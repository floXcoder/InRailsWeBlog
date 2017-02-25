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

  # == Relationships ========================================================
  belongs_to :article

  belongs_to :tag,
             counter_cache: true

  # == Validations ==========================================================
  validates :article,
            presence: true,
            on: :update
  validates :tag,
            presence: true,
            on: :update

  validates_uniqueness_of :article_id, scope: :tag_id, allow_nil: true

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
