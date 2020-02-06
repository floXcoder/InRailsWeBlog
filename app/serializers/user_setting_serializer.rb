# frozen_string_literal: true

class UserSettingSerializer
  include FastJsonapi::ObjectSerializer
  include NullAttributesRemover

  set_type :settings

  set_key_transform :camel_lower

  attribute :articles_loader do |object|
    object.respond_to?(:articles_loader) ? object.articles_loader : nil
  end

  attribute :article_display do |object|
    object.respond_to?(:article_display) ? object.article_display : nil
  end

  attribute :article_order do |object|
    object.respond_to?(:article_order) ? object.article_order : nil
  end

  attribute :tag_parent_and_child do |object|
    object.respond_to?(:tag_parent_and_child) ? object.tag_parent_and_child : nil
  end

  attribute :tag_sidebar_pin do |object|
    object.respond_to?(:tag_sidebar_pin) ? object.tag_sidebar_pin : nil
  end

  attribute :tag_sidebar_with_child do |object|
    object.respond_to?(:tag_sidebar_with_child) ? object.tag_sidebar_with_child : nil
  end

  attribute :tag_order do |object|
    object.respond_to?(:tag_order) ? object.tag_order : nil
  end

  attribute :search_display do |object|
    object.respond_to?(:search_display) ? object.search_display : nil
  end

  attribute :search_highlight do |object|
    object.respond_to?(:search_highlight) ? object.search_highlight : nil
  end

  attribute :search_operator do |object|
    object.respond_to?(:search_operator) ? object.search_operator : nil
  end

  attribute :search_exact do |object|
    object.respond_to?(:search_exact) ? object.search_exact : nil
  end
end
