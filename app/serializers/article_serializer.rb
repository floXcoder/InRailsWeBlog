# == Schema Information
#
# Table name: articles
#
#  id                        :integer          not null, primary key
#  author_id                 :integer          not null
#  topic_id                  :integer          not null
#  title                     :string           default("")
#  summary                   :text             default("")
#  content                   :text             default(""), not null
#  private_content           :boolean          default(FALSE), not null
#  is_link                   :boolean          default(FALSE), not null
#  reference                 :text
#  temporary                 :boolean          default(FALSE), not null
#  language                  :string
#  allow_comment             :boolean          default(TRUE), not null
#  notation                  :integer          default(0)
#  priority                  :integer          default(0)
#  visibility                :integer          default(0), not null
#  archived                  :boolean          default(FALSE), not null
#  accepted                  :boolean          default(TRUE), not null
#  bookmarked_articles_count :integer          default(0)
#  outdated_articles_count   :integer          default(0)
#  slug                      :string
#  deleted_at                :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#

class ArticleSerializer < ActiveModel::Serializer
  cache key: 'article', expires_in: 12.hours

  attributes :id,
             :title,
             :summary,
             :content,
             :highlight_content,
             :reference,
             :updated_at,
             :allow_comment,
             :visibility,
             :visibility_translated,
             :is_link,
             :temporary,
             :bookmarked,
             :outdated,
             :slug,
             :votes_up,
             :votes_down,
             :outdated_number,
             :comments_number,
             :new_tags

  belongs_to :author, serializer: UserSampleSerializer
  has_many :tags, serializer: TagSampleSerializer
  has_many :parent_tags, serializer: TagSampleSerializer
  has_many :child_tags, serializer: TagSampleSerializer
  has_many :comments

  def content
    current_user_id = defined?(current_user) && current_user ? current_user.id : nil
    object.adapted_content(current_user_id)
  end

  def highlight_content
    if instance_options[:highlight] && !instance_options[:highlight].empty? && instance_options[:highlight][object.id]
      if defined?(current_user) && current_user && current_user.id == object.id
        instance_options[:highlight][object.id]["content_#{I18n.locale.to_s}".to_sym]
      else
        instance_options[:highlight][object.id]["public_content_#{I18n.locale.to_s}".to_sym]
      end
    end
  end

  def updated_at
    I18n.l(object.updated_at, format: :custom).mb_chars.downcase.to_s
  end

  def visibility_translated
    object.visibility_to_tr
  end

  def bookmarked
    if defined?(current_user) && current_user
      object.user_bookmarks.exists?(current_user.id)
    else
      false
    end
  end

  def outdated
    if defined?(current_user) && current_user
      object.marked_as_outdated.exists?(current_user.id)
    else
      false
    end
  end

  def votes_up
    object.votes_for
  end

  def votes_down
    object.votes_against
  end

  def outdated_number
    object.outdated_articles_count
  end

  def comments_number
    object.tracker.comments_count
  end

  def comments
    object.comments_tree.flatten if instance_options[:comments]
  end

  def new_tags
    if instance_options[:new_tags] && !instance_options[:new_tags].empty?
      instance_options[:new_tags].map do |tag|
        TagSampleSerializer.new(tag).attributes
      end
    end
  end
end

