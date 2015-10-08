# == Schema Information
#
# Table name: articles
#
#  id            :integer          not null, primary key
#  author_id     :integer          not null
#  visibility    :integer          default(0), not null
#  notation      :integer          default(0)
#  priority      :integer          default(0)
#  allow_comment :boolean          default(FALSE), not null
#  slug          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class Article < ActiveRecord::Base

  # Associations
  belongs_to :author, class_name: 'User'

  ## Comment
  # has_many :comments, as: :commentable

  ## Tags
  has_and_belongs_to_many :tags

  ## Picture
  has_many  :picture, as: :imageable, autosave: true, dependent: :destroy
  accepts_nested_attributes_for :picture, allow_destroy: true, reject_if: lambda {
                                            |picture| picture['image'].blank? && picture['image_tmp'].blank?
                                        }

  # Parameters validation
  validates :author_id, presence: true
  validates :title,
            length:     { minimum: 1, maximum: 128 },
            if: 'title.present?'
  validates :summary,
            length:     { minimum: 1, maximum: 256 },
            if: 'summary.present?'
  validates :content,
            presence:   true,
            length:     { minimum: 3, maximum: 12_000 }

  # Translation
  translates :title, :summary, :content, fallbacks_for_empty_translations: true

  # Enum
  include Shared::EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('article', [:visibility])

  # Nice url format
  include Shared::NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Search
  # searchkick autocomplete: [:title],
  #            suggest: [:title],
  #            highlight: [:content],
  #            language: (I18n.locale == :en) ? 'English' : 'French'

  # Friendly ID
  def slug_candidates
    [
        :title,
        [:title, :summary]
    ]
  end

end
