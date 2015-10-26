# == Schema Information
#
# Table name: tagged_articles
#
#  id         :integer          not null, primary key
#  article_id :integer
#  tag_id     :integer
#  parent     :boolean          default(FALSE), not null
#  child      :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class TaggedArticle < ActiveRecord::Base
  belongs_to :article
  belongs_to :tag

  # Parameters validation
  validates :article_id,  presence: true, on: :update
  validates :tag_id,      presence: true, on: :update

  validates_uniqueness_of :article_id, scope: :tag_id, allow_nil: true
end
