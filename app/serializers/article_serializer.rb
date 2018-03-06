# == Schema Information
#
# Table name: articles
#
#  id                      :integer          not null, primary key
#  user_id                 :integer
#  topic_id                :integer
#  mode                    :integer          default("story"), not null
#  title_translations      :jsonb
#  summary_translations    :jsonb
#  content_translations    :jsonb            not null
#  languages               :string           default([]), not null, is an Array
#  reference               :text
#  draft                   :boolean          default(FALSE), not null
#  notation                :integer          default(0)
#  priority                :integer          default(0)
#  visibility              :integer          default("everyone"), not null
#  accepted                :boolean          default(TRUE), not null
#  archived                :boolean          default(FALSE), not null
#  allow_comment           :boolean          default(TRUE), not null
#  pictures_count          :integer          default(0)
#  outdated_articles_count :integer          default(0)
#  bookmarks_count         :integer          default(0)
#  comments_count          :integer          default(0)
#  slug                    :string
#  deleted_at              :datetime
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#

class ArticleSerializer < ActiveModel::Serializer
  cache key: 'article', expires_in: 12.hours

  attributes :id,
             :mode,
             :mode_translated,
             :topic_id,
             :title,
             :summary,
             :content,
             :reference,
             :date,
             :date_short,
             :visibility,
             :visibility_translated,
             :allow_comment,
             :draft,
             :current_language,
             :bookmarked,
             :outdated,
             :slug,
             :votes_up,
             :votes_down,
             :pictures_count,
             :bookmarks_count,
             :comments_count,
             :outdated_count,
             :parent_tag_ids,
             :child_tag_ids,
             :new_tag_ids

  belongs_to :user, serializer: UserSampleSerializer
  has_many :tags, serializer: TagSampleSerializer
  # has_many :parent_tags, serializer: TagSampleSerializer
  # has_many :child_tags, serializer: TagSampleSerializer

  def content
    current_user_id = defined?(current_user) && current_user&.id
    object.adapted_content(current_user_id)
  end

  def date
    I18n.l(object.updated_at, format: :custom_full_date).sub(/^[0]+/, '')
  end

  def date_short
    I18n.l(object.updated_at, format: :short).split(' ').map(&:capitalize)
  end

  def visibility_translated
    object.visibility_to_tr
  end

  # TODO: N+1 query problem
  # TODO: directly use current_user_id ?
  def bookmarked
    if defined?(current_user) && current_user
      object.bookmarked?(current_user)

      # object.user_bookmarks.exists?(current_user.id)
      # object.bookmarks.find_by(user_id: current_user.id)&.id
    else
      false
    end
  end

  def outdated
    if instance_options[:with_outdated] && defined?(current_user) && current_user
      object.marked_as_outdated.exists?(current_user.id)
    else
      false
    end
  end

  def votes_up
    object.votes_for if instance_options[:with_vote]
  end

  def votes_down
    object.votes_against if instance_options[:with_vote]
  end

  def outdated_count
    object.outdated_articles_count
  end

  def comments
    object.comments_tree.flatten if instance_options[:comments]
  end

  def parent_tag_ids
    object.tagged_articles.select(&:parent?).map(&:tag_id)
  end

  def child_tag_ids
    object.tagged_articles.select(&:child?).map(&:tag_id)
  end

  def new_tag_ids
    instance_options[:new_tags].map(&:id) if instance_options[:new_tags].present?
  end
end

