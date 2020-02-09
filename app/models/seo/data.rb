# frozen_string_literal: true

class Seo::Data < ApplicationRecord

  # == Attributes ===========================================================
  # Always add new routes to the end of the array
  NAMED_ROUTES = [:home, :user_home, :search, :tags, :topic_tags, :show_tag, :edit_tag, :sort_tag, :user_topics, :user_topic, :edit_topic, :edit_inventories_topic, :user_articles, :topic_articles, :tagged_topic_articles, :tagged_articles, :order_topic_articles, :sort_topic_articles, :user_article, :shared_article, :new_article, :edit_article, :history_article, :show_user, :edit_user, :new_password, :edit_password, :about_us]

  # Strip whitespaces
  auto_strip_attributes :page_title, :meta_desc

  # == Extensions ===========================================================

  # == Relationships ========================================================

  # == Validations ==========================================================
  validates :name,
            presence: true,
            uniqueness: { case_sensitive: false }

  validates :page_title,
            presence: true

  validate :route_name

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================
  def self.local_named_routes
    NAMED_ROUTES.map { |route| I18n.available_locales.map { |locale| "#{route}_#{locale}" } }.flatten
  end

  def self.convert_parameters(string, parameters)
    string.gsub(/:(\w+)/) do |match|
      key = ($1 || $2 || match.tr(':', '')).to_sym
      value = if parameters.key?(key)
                parameters[key]
              else
                raise I18n::MissingInterpolationArgument.new(key, parameters, string)
              end
      $3 ? sprintf(":#{$3}", value) : value
    end
  end

  def self.associated_parameters
    {
      tag_slug: [:user_slug],
      topic_slug: [:user_slug],
      article_slug: [:user_slug, :topic_slug],
      comment_slug: [:user_slug, :topic_slug, :article_slug]
    }
  end

  # == Instance Methods =====================================================

  private

  def route_name
    return unless self.name.present? && self.name_changed?

    unless Seo::Data.local_named_routes.include?(self.name)
      errors.add(:base, I18n.t('activerecord.errors.models.seo_data.bad_route_name'))
    end
  end

end
