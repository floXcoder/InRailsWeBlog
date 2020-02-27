# frozen_string_literal: true

class Seo::Data < ApplicationRecord

  # == Attributes ===========================================================
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
    Rails.application.routes.routes.map do |r|
      next unless r.name.present? && r.defaults.has_key?(:locale)

      OpenStruct.new({
        name: r.name,
        params: r.defaults.except(:controller),
        parts: r.parts - [:format],
      })
    end.compact
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

    unless Seo::Data.local_named_routes.map(&:name).include?(self.name)
      errors.add(:base, I18n.t('activerecord.errors.models.seo_data.bad_route_name'))
    end
  end

end
