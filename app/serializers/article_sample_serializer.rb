# frozen_string_literal: true

class ArticleSampleSerializer
  include FastJsonapi::ObjectSerializer
  include NullAttributesRemover

  set_type :article

  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :topic_id,
             :mode,
             :summary,
             :draft,
             :visibility,
             :default_picture,
             :slug,
             :outdated_articles_count,
             :comments_count

  belongs_to :user, serializer: UserSampleSerializer

  has_many :tags, serializer: TagSampleSerializer

  attribute :mode_translated do |object|
    object.mode_to_tr
  end

  attribute :title do |object, params|
    params.dig(:highlight_results, object.id, :title).presence&.gsub(/\n{3,}/, "\n\n") || object.title
  end

  attribute :content do |object, params|
    params.dig(:highlight_results, object.id, :content).presence&.gsub(/\n{3,}/, "\n\n") || object.summary_content
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
    end
  end

  attribute :date do |object|
    I18n.l(object.updated_at, format: :custom_full_date).sub(/^[0]+/, '')
  end

  attribute :date_short do |object|
    I18n.l(object.created_at, format: :short).split(' ').map(&:capitalize)
  end

  attribute :date_iso do |object|
    object.updated_at.strftime('%Y-%m-%d')
  end

  attribute :parent_tag_ids do |object|
    object.tagged_articles.select(&:parent?).map(&:tag_id)
  end

  attribute :child_tag_ids do |object|
    object.tagged_articles.select(&:child?).map(&:tag_id)
  end
end
