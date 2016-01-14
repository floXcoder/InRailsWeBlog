# == Schema Information
#
# Table name: articles
#
#  id              :integer          not null, primary key
#  author_id       :integer          not null
#  visibility      :integer          default(0), not null
#  notation        :integer          default(0)
#  priority        :integer          default(0)
#  allow_comment   :boolean          default(TRUE), not null
#  private_content :boolean          default(FALSE), not null
#  is_link         :boolean          default(FALSE), not null
#  temporary       :boolean          default(FALSE), not null
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class ArticleSampleSerializer < ActiveModel::Serializer
  cache key: 'article_sample', expires_in: 12.hours

  attributes :id,
             :title,
             :summary,
             :content,
             :visibility,
             :temporary,
             :is_link,
             :comments_number,
             :updated_at,
             :link

  belongs_to :author, serializer: UserSampleSerializer
  has_many :tags, serializer: TagSampleSerializer

  def content
    object.summary_content
  end

  def updated_at
    I18n.l(object.updated_at, format: :custom).downcase
  end

  def comments_number
    object.tracker.comments_count
  end

  include Rails.application.routes.url_helpers
  def link
    article_path(object)
  end
end

