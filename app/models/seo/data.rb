# frozen_string_literal: true

# == Schema Information
#
# Table name: seo_datas
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  locale     :string           not null
#  parameters :string           default([]), not null, is an Array
#  page_title :jsonb            not null
#  meta_desc  :jsonb            not null
#  languages  :string           default([]), not null, is an Array
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Seo::Data < ApplicationRecord

  # == Attributes ===========================================================
  # Strip whitespaces
  auto_strip_attributes :page_title, :meta_desc

  # == Extensions ===========================================================

  # == Relationships ========================================================

  # == Validations ==========================================================
  validates :name,
            presence:   true,
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
                       name:   r.name,
                       params: r.defaults.except(:controller),
                       parts:  r.parts - [:format]
                     })
    end.compact
  end

  def self.convert_parameters(string, parameters)
    string.gsub(/:(\w+)/) do |match|
      key   = ($1 || $2 || match.tr(':', '')).to_sym
      value = if parameters.key?(key)
                parameters[key]
              else
                raise I18n::MissingInterpolationArgument.new(key, parameters, string)
              end
      $3 ? sprintf(":#{$3}", value) : value
    end
  end

  def self.associated_parameters
    # Add custom parameters to SEO data
    {
      tag_slug:     [:user_slug, :tag_content],
      topic_slug:   [:user_slug, :topic_content],
      article_slug: [:user_slug, :topic_slug, :article_content],
      comment_slug: [:user_slug, :topic_slug, :article_slug]
    }
  end

  def self.slug_parameters(parameters)
    new_parameters = {}

    parameters.each do |slug_name, model|
      new_parameters[slug_name] = model.respond_to?(:slug) ? model.slug : model
    end

    return new_parameters
  end

  def self.named_parameters(parameters)
    new_parameters = {}

    parameters.each do |slug_name, model|
      value = self.slug_from_model(model)

      unless value
        slug_model = self.model_from_slug(slug_name, model)
        if slug_model
          value = self.slug_from_model(slug_model)
        else
          value = model
        end
      end

      new_parameters[slug_name] = value
    end

    return new_parameters
  end

  def self.slug_from_model(model)
    if model.is_a?(User)
      model.pseudo
    elsif model.is_a?(Tag)
      model.name
    elsif model.is_a?(Topic)
      model.name
    elsif model.is_a?(Article)
      model.title
    end
  end

  def self.model_from_slug(slug, model)
    if slug == :user_slug
      User.friendly.find(model)
    elsif slug == :tag_slug
      Tag.friendly.find(model)
    elsif slug == :topic_slug
      Topic.friendly.find(model)
    elsif slug == :article_slug
      Article.friendly.find(model)
    end
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
