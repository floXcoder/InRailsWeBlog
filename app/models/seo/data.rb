# frozen_string_literal: true

class Seo::Data < ApplicationRecord

  # == Attributes ===========================================================
  # Always add new routes to the end of the array
  NAMED_ROUTES = [:home, :user_home, :tags, :topic_tags, :show_tag, :edit_tag, :sort_tag, :user_topics, :user_topic, :edit_topic, :edit_inventories_topic, :user_articles, :topic_articles, :tagged_topic_articles, :tagged_articles, :order_topic_articles, :sort_topic_articles, :user_article, :shared_article, :new_article, :edit_article, :history_article, :show_user, :edit_user, :new_password, :edit_password]
  enum name: NAMED_ROUTES

  include TranslationConcern
  # Add current_language as attribute
  translates :page_title, :meta_desc,
             auto_strip_translation_fields:    [:page_title, :meta_desc],
             fallbacks_for_empty_translations: true

  # == Extensions ===========================================================

  # == Relationships ========================================================

  # == Validations ==========================================================
  validates :name,
            presence: true,
            uniqueness: { case_sensitive: false }

  validates :page_title,
            presence: true

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================
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

end
