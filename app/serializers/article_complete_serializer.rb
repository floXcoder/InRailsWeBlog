# frozen_string_literal: true

class ArticleCompleteSerializer
  include FastJsonapi::ObjectSerializer

  set_type :article

  cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :topic_id,
             :mode,
             :mode_translated,
             :title,
             :summary,
             # :content,
             :reference,
             # :inventories,
             :visibility,
             :allow_comment,
             :draft,
             :current_language,
             :slug,
             :pictures_count,
             :bookmarks_count,
             :comments_count

  has_one :tracker, serializer: TrackerSerializer

  attribute :date do |object|
    I18n.l(object.updated_at, format: :custom).sub(/^[0]+/, '')
  end

  attribute :date_short do |object|
    I18n.l(object.updated_at, format: :short).split(' ').map(&:capitalize)
  end

  attribute :visibility_translated do |object|
    object.visibility_to_tr
  end

  attribute :public_share_link do |object, params|
    "#{Rails.application.routes.url_helpers.root_url(host: ENV['WEBSITE_ADDRESS'])}articles/shared/#{object.slug}/#{object.share&.public_link}" if params[:with_share]
  end

  attribute :votes_up do |object|
    object.votes_for
  end

  attribute :votes_down do |object|
    object.votes_against
  end

  attribute :outdated_count do |object|
    object.outdated_articles_count
  end

  attribute :comments do |object, params|
    object.comments_tree.flatten if params[:comments]
  end

  attribute :parent_tag_ids do |object|
    object.tagged_articles.select(&:parent?).map(&:tag_id)
  end

  attribute :child_tag_ids do |object|
    object.tagged_articles.select(&:child?).map(&:tag_id)
  end

  attribute :link do |object|
    Rails.application.routes.url_helpers.show_article_path(user_slug: object.user.slug, article_slug: object.slug)
  end
end
