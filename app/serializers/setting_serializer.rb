# frozen_string_literal: true

# == Schema Information
#
# Table name: settings
#
#  id         :bigint(8)        not null, primary key
#  var        :string           not null
#  value      :text
#  thing_id   :integer
#  thing_type :string(30)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class SettingSerializer < ActiveModel::Serializer
  include NullAttributesRemover

  # cache key: 'settings', expires_in: CONFIG.cache_time

  attributes :articles_loader,
             :article_display,
             :article_order,
             :tag_parent_and_child,
             :tag_sidebar_pin,
             :tag_sidebar_with_child,
             :tag_order,
             :search_highlight,
             :search_operator,
             :search_exact

  def articles_loader
    object.respond_to?(:articles_loader) ? object.articles_loader : nil
  end

  def article_display
    object.respond_to?(:article_display) ? object.article_display : nil
  end

  def article_order
    object.respond_to?(:article_order) ? object.article_order : nil
  end

  def tag_parent_and_child
    object.respond_to?(:tag_parent_and_child) ? object.tag_parent_and_child : nil
  end

  def tag_sidebar_pin
    object.respond_to?(:tag_sidebar_pin) ? object.tag_sidebar_pin : nil
  end

  def tag_sidebar_with_child
    object.respond_to?(:tag_sidebar_with_child) ? object.tag_sidebar_with_child : nil
  end

  def tag_order
    object.respond_to?(:tag_order) ? object.tag_order : nil
  end

  def search_highlight
    object.respond_to?(:search_highlight) ? object.search_highlight : nil
  end

  def search_operator
    object.respond_to?(:search_operator) ? object.search_operator : nil
  end

  def search_exact
    object.respond_to?(:search_exact) ? object.search_exact : nil
  end
end
