# == Schema Information
#
# Table name: bookmarks
#
#  id              :integer          not null, primary key
#  user_id         :integer          not null
#  bookmarked_type :string           not null
#  bookmarked_id   :integer          not null
#  follow          :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class Bookmark < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================
  include PublicActivity::Model
  tracked owner: :user, recipient: :bookmarked

  # == Relationships ========================================================
  belongs_to :user

  belongs_to :bookmarked,
             polymorphic:   true,
             counter_cache: true

  # == Validations ==========================================================
  validates :user_id,
            presence: true

  validates :bookmarked_id,
            :bookmarked_type,
            presence: true

  validates_uniqueness_of :user_id,
                          scope:     [:bookmarked_id, :bookmarked_type],
                          allow_nil: false

  # == Scopes ===============================================================
  scope :users, -> { where(bookmarked_type: 'User').includes(:bookmarked) }
  scope :articles, -> { where(bookmarked_type: 'Article').includes(:bookmarked) }
  scope :tags, -> { where(bookmarked_type: 'Tag').includes(:bookmarked) }

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================
  def user?(user)
    user.id == user.id
  end

  def add(user, model_name, model_id)
    if user && model_name && model_id
      model_class    = model_name.classify.constantize
      related_object = model_class.find_by(id: model_id)

      if user.bookmarks.exists?(bookmarked_id: model_id, bookmarked_type: model_name.classify)
        errors.add(:base, I18n.t('activerecord.errors.models.bookmark.already_bookmarked'))
        return false
      elsif !related_object
        errors.add(:base, I18n.t('activerecord.errors.models.bookmark.model_unkown'))
        return false
      else
        self.bookmarked_id   = model_id
        self.bookmarked_type = model_name.classify
        return self.save
      end
    else
      errors.add(:base, I18n.t('activerecord.errors.models.bookmark.model_unkown'))
      return false
    end
  end

  def remove(user, model_name, model_id)
    if user && model_name && model_id
      model_class    = model_name.classify.constantize
      related_object = model_class.find_by(id: model_id)

      if !user.bookmarks.exists?(bookmarked_id: model_id, bookmarked_type: model_name.classify)
        errors.add(:bookmark, I18n.t('activerecord.errors.models.bookmark.not_bookmarked'))
        return false
      elsif !related_object
        errors.add(:base, I18n.t('activerecord.errors.models.bookmark.model_unkown'))
        return false
      else
        return self.destroy
      end
    else
      errors.add(:bookmark, I18n.t('activerecord.errors.models.bookmark.model_unkown'))
      return false
    end
  end

end
