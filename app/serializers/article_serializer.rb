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

class ArticleSerializer
  include FastJsonapi::ObjectSerializer

  set_type :article

  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :topic_id,
             :mode,
             :mode_translated,
             :title,
             :summary,
             :reference,
             :visibility,
             :allow_comment,
             :draft,
             :languages,
             :default_picture,
             :slug,
             :pictures_count,
             :bookmarks_count,
             :comments_count

  belongs_to :user, serializer: UserSampleSerializer

  has_many :tags, serializer: TagSampleSerializer do |object, params|
    if object.user_id == params[:current_user_id]
      object.tags
    else
      object.tags.select { |tag| tag.visibility == 'everyone' }
    end
  end

  attribute :content do |object, params|
    object.adapted_content(params[:current_user_id])
  end

  attribute :inventories do |object|
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

  attribute :date do |object|
    I18n.l(object.created_at, format: :custom_full_date).sub(/^[0]+/, '')
  end

  attribute :date_short do |object|
    I18n.l(object.created_at, format: :short).split(' ').map(&:capitalize)
  end

  attribute :date_iso do |object|
    object.updated_at.strftime('%Y-%m-%d')
  end

  attribute :visibility_translated do |object|
    object.visibility_to_tr
  end

  attribute :parent_tag_ids do |object|
    object.tagged_articles.select(&:parent?).map(&:tag_id)
  end

  attribute :child_tag_ids do |object|
    object.tagged_articles.select(&:child?).map(&:tag_id)
  end

  # attribute :outdated_count do |object|
  #   object.outdated_articles_count
  # end

  # attribute :outdated do |object, params|
  #   if params[:with_outdated] && params[:current_user_id]
  #     object.marked_as_outdated.exists?(params[:current_user_id])
  #   else
  #     false
  #   end
  # end

  # attribute :votes_up do |object, params|
  #   object.votes_for if params[:with_vote]
  # end
  #
  # attribute :votes_down do |object, params|
  #   object.votes_against if params[:with_vote]
  # end
end
