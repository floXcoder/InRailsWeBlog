# == Schema Information
#
# Table name: bookmarked_articles
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  article_id :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class BookmarkedArticle < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================
  include PublicActivity::Model
  tracked owner: :user, recipient: :article

  # == Relationships ========================================================
  belongs_to :article, counter_cache: true
  belongs_to :user

  # == Validations ==========================================================
  validates :user_id, presence: true
  validates :article_id, presence: true

  validates_uniqueness_of :user_id, scope: :article_id, allow_nil: false

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
