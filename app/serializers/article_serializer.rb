# == Schema Information
#
# Table name: articles
#
#  id                      :integer          not null, primary key
#  user_id                 :integer
#  topic_id                :integer
#  title                   :string
#  summary                 :text
#  content                 :text             not null
#  reference               :text
#  draft                   :boolean          default(FALSE), not null
#  language                :string
#  allow_comment           :boolean          default(TRUE), not null
#  notation                :integer          default(0)
#  priority                :integer          default(0)
#  visibility              :integer          default("everyone"), not null
#  accepted                :boolean          default(TRUE), not null
#  archived                :boolean          default(FALSE), not null
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
             :topic_id,
             :title,
             :summary,
             :content,
             :highlight_content,
             :reference,
             :updated_at,
             :allow_comment,
             :visibility,
             :visibility_translated,
             :draft,
             # :bookmarked,
             # :outdated,
             :slug,
             # :votes_up,
             # :votes_down,
             :outdated_number,
             :comments_number,
             :new_tags

  belongs_to :user, serializer: UserSampleSerializer
  has_many :tags, serializer: TagSampleSerializer
  has_many :parent_tags, serializer: TagSampleSerializer
  has_many :child_tags, serializer: TagSampleSerializer

  def content
    current_user_id = defined?(current_user) && current_user ? current_user.id : nil
    object.adapted_content(current_user_id)
  end

  def highlight_content
    if instance_options[:highlight].present? && instance_options[:highlight][object.id]
      if defined?(current_user) && current_user && current_user.id == object.id
        instance_options[:highlight][object.id]["content_#{I18n.locale}".to_sym]
      else
        instance_options[:highlight][object.id]["public_content_#{I18n.locale}".to_sym]
      end
    end
  end

  def updated_at
    I18n.l(object.updated_at, format: :custom).mb_chars.downcase.to_s
  end

  def visibility_translated
    object.visibility_to_tr
  end

  # TODO: N+1 query problem
  # def bookmarked
  #   if defined?(current_user) && current_user
  #     object.user_bookmarks.exists?(current_user.id)
  #   else
  #     false
  #   end
  # end

  # TODO: N+1 query problem
  # def outdated
  #   if defined?(current_user) && current_user
  #     object.marked_as_outdated.exists?(current_user.id)
  #   else
  #     false
  #   end
  # end

  # TODO: N+1 query problem
  # def votes_up
  #   object.votes_for
  # end

  # TODO: N+1 query problem
  # def votes_down
  #   object.votes_against
  # end

  def outdated_number
    object.outdated_articles_count
  end

  def comments_number
    object.comments_count
  end

  def comments
    object.comments_tree.flatten if instance_options[:comments]
  end

  def new_tags
    if instance_options[:new_tags].present?
      instance_options[:new_tags].map do |tag|
        TagSampleSerializer.new(tag).attributes
      end
    end
  end
end

