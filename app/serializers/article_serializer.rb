# frozen_string_literal: true

# == Schema Information
#
# Table name: articles
#
#  id                      :bigint           not null, primary key
#  user_id                 :bigint
#  topic_id                :bigint
#  mode                    :integer          default("note"), not null
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
#  contributor_id          :bigint
#  inventories             :jsonb            not null
#

class ArticleSerializer < ActiveModel::Serializer
  cache key: 'article', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :topic_id,
             :mode,
             :mode_translated,
             :title,
             :summary,
             :content,
             :reference,
             :inventories,
             :date,
             :date_short,
             :visibility,
             :visibility_translated,
             :allow_comment,
             :draft,
             :current_language,
             :outdated,
             :default_picture,
             :slug,
             :public_share_link,
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

  has_many :tags, serializer: TagSampleSerializer do
    if scope.is_a?(User)
      object.tags
    else
      object.tags.select { |tag| tag.visibility == 'everyone' }
    end
  end

  def content
    current_user_id = defined?(current_user) && current_user&.id
    object.adapted_content(current_user_id)
  end

  def inventories
    if object.inventory?
      object.topic.inventory_fields.map do |inventory_field|
        inventory_value = object.inventories[inventory_field.field_name]

        {
          fieldName: inventory_field.field_name,
          name:      inventory_field.name,
          value:     inventory_value,
          type:      inventory_field.value_type
        }
      end
    else
      []
    end
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

  def outdated
    if instance_options[:with_outdated] && defined?(current_user) && current_user
      object.marked_as_outdated.exists?(current_user.id)
    else
      false
    end
  end

  def public_share_link
    "#{Rails.application.routes.url_helpers.root_url(host: ENV['WEBSITE_ADDRESS'])}articles/shared/#{object.slug}/#{object.share&.public_link}" if instance_options[:with_share]
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
