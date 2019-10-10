# frozen_string_literal: true

class ArticleCompleteSerializer < ActiveModel::Serializer
  cache key: 'article_complete', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :topic_id,
             :mode,
             :mode_translated,
             :title,
             :summary,
             # :content,
             :reference,
             # :inventories,
             :date,
             :date_short,
             :visibility,
             :visibility_translated,
             :allow_comment,
             :draft,
             :current_language,
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
             :link

  # belongs_to :user, serializer: UserSampleSerializer
  #
  # belongs_to :topic, if: -> { object.story? }, serializer: TopicSampleSerializer
  #
  # has_many :tags, serializer: TagSampleSerializer do
  #   if scope.is_a?(User)
  #     object.tags
  #   else
  #     object.tags.select { |tag| tag.visibility == 'everyone' }
  #   end
  # end

  has_one :tracker

  def date
    I18n.l(object.updated_at, format: :custom_full_date).sub(/^[0]+/, '')
  end

  def date_short
    I18n.l(object.updated_at, format: :short).split(' ').map(&:capitalize)
  end

  def visibility_translated
    object.visibility_to_tr
  end

  def public_share_link
    "#{Rails.application.routes.url_helpers.root_url(host: ENV['WEBSITE_ADDRESS'])}articles/shared/#{object.slug}/#{object.share&.public_link}" if instance_options[:with_share]
  end

  def votes_up
    object.votes_for
  end

  def votes_down
    object.votes_against
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

  def link
    Rails.application.routes.url_helpers.show_article_path(user_slug: object.user.slug, article_slug: object.slug)
  end
end
