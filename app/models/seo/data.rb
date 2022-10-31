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
    Rails.application.routes.routes.filter_map do |r|
      next unless r.name.present? && r.defaults.has_key?(:locale)

      OpenStruct.new(
        name:   r.name,
        params: r.defaults.except(:controller),
        parts:  r.parts - [:format]
      )
    end
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
        value      = if slug_model
                       self.slug_from_model(slug_model)
                     else
                       model
                     end
      end

      new_parameters[slug_name] = value
    end

    return new_parameters
  end

  def self.slug_from_model(model)
    case model
    when User
      model.pseudo
    when Tag, Topic
      model.name
    when Article
      model.title
    end
  end

  def self.model_from_slug(slug, model)
    case slug
    when :user_slug
      User.friendly.find(model)
    when :tag_slug
      Tag.friendly.find(model)
    when :topic_slug
      Topic.friendly.find(model)
    when :article_slug
      Article.friendly.find(model)
    end
  rescue ActiveRecord::RecordNotFound
    nil
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
