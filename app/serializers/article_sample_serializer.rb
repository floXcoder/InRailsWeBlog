# frozen_string_literal: true

class ArticleSampleSerializer < ActiveModel::Serializer
  include NullAttributesRemover

  cache key: 'article_sample', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :topic_id,
             :mode,
             :mode_translated,
             :title,
             :summary,
             :content,
             :inventories,
             :draft,
             :visibility,
             :current_language,
             :date,
             :date_short,
             :default_picture,
             :slug,
             :outdated_articles_count,
             :comments_count,
             :parent_tag_ids,
             :child_tag_ids

  belongs_to :user, serializer: UserSampleSerializer

  has_many :tags, serializer: TagSampleSerializer

  def mode_translated
    object.mode_to_tr
  end

  def title
    instance_options.dig(:highlight_results, object.id, :title).presence || object.title
  end

  def content
    instance_options.dig(:highlight_results, object.id, :content).presence || object.summary_content
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
      nil
    end
  end

  def date
    I18n.l(object.updated_at, format: :custom_full_date).sub(/^[0]+/, '')
  end

  def date_short
    I18n.l(object.updated_at, format: :short).split(' ').map(&:capitalize)
  end

  def parent_tag_ids
    object.tagged_articles.select(&:parent?).map(&:tag_id)
  end

  def child_tag_ids
    object.tagged_articles.select(&:child?).map(&:tag_id)
  end
end
