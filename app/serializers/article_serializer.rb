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
#  deleted_at              :datetime
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  contributor_id          :bigint
#  inventories             :jsonb            not null
#  slug                    :jsonb
#

class ArticleSerializer
  include FastJsonapi::ObjectSerializer
  include NullAttributesRemover

  extend SerializerHelper

  set_type :article

  cache_options store: SerializerHelper::CacheSerializer, namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer", expires_in: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :user_id,
             :topic_id,
             :mode,
             :summary,
             :reference,
             :visibility,
             :allow_comment,
             :draft,
             :languages,
             :default_picture,
             :user_slug,
             :topic_slug,
             :topic_name,
             :tag_names,
             :pictures_count,
             :bookmarks_count,
             :comments_count

  belongs_to :user, serializer: UserSerializer

  belongs_to :topic, serializer: TopicSerializer

  has_one :tracker, serializer: TrackerSerializer

  has_many :tags, serializer: TagSerializer do |object, params|
    if object.user_id == params[:current_user_id]
      object.tags
    else
      object.tags.select { |tag| tag.visibility == 'everyone' }
    end
  end

  attribute :mode_translated do |object|
    object.mode_to_tr
  end

  attribute :slug do |object|
    if object.slug.present?
      object.slug
    else
      locale_article = object.languages.first
      object.slug_translations[locale_article]
    end
  end

  attribute :slug_translations do |object|
    object[Article.friendly_id_config.slug_column] if object.languages.size > 1 || object.topic.languages.size > 1
  end

  attribute :title do |object, params|
    params.dig(:highlight_results, object.id, :title).presence&.gsub(/\n{3,}/, "\n\n") || object.title
  end

  attribute :title_translations do |object|
    object.title_translations if object.languages.size > 1 || object.topic.languages.size > 1
  end

  attribute :content do |object, params|
    params.dig(:highlight_results, object.id, :content).presence&.gsub(/\n{3,}/, "\n\n") || object.adapted_content(params[:current_user_id])
  end

  attribute :content_summary do |object|
    object.summary_content(260, strip_html: false)
  end

  attribute :content_translations do |object|
    object.content_translations if object.languages.size > 1 || object.topic.languages.size > 1
  end

  attribute :content_highlighted do |object|
    object.respond_to?(:highlight) && object.respond_to?(:highlighted_content) && object.highlight.has_key?('content.word_middle') ? object.highlighted_content&.squish&.strip : nil
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
    I18n.l(object.created_at, format: :custom_full_date).sub(/^0+/, '')
  end

  attribute :date_short do |object|
    I18n.l(object.created_at, format: :short).split.map(&:capitalize)
  end

  attribute :updated_date do |object|
    I18n.l(object.updated_at, format: :custom_full_date).sub(/^0+/, '')
  end

  attribute :date_iso do |object|
    object.updated_at.strftime('%Y-%m-%d')
  end

  attribute :date_timestamp do |object|
    object.created_at.to_i
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

  attribute :public_share_link do |object|
    if object.public_share_link
      "#{Rails.application.routes.url_helpers.root_url(host: ENV['WEBSITE_FULL_ADDRESS'])}articles/shared/#{object.slug}/#{object.public_share_link}"
    else
      nil
    end
  end

  attribute :link do |object|
    Rails.application.routes.url_helpers.user_article_path(user_slug: object.respond_to?(:user_slug) ? object.user_slug : object.user.slug, article_slug: object.slug)

    # if object.slug.present?
    #   Rails.application.routes.url_helpers.user_article_path(user_slug: object.respond_to?(:user_slug) ? object.user_slug : object.user.slug, article_slug: object.slug)
    # else
    #   locale_article = object.languages.first
    #   localized_slug_article = object.slug_translations[locale_article]
    #
    #   Rails.application.routes.url_helpers.send("user_article_#{locale_article}_path", user_slug: object.respond_to?(:user_slug) ? object.user_slug : object.user.slug, article_slug: localized_slug_article)
    # end
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
