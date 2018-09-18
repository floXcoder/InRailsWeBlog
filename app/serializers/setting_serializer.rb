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
  cache key: 'settings', expires_in: CONFIG.cache_time

  attributes :articles_loader,
             :article_display,
             :article_order,
             :article_child_tagged,
             :tag_sidebar_pin,
             :tag_sidebar_with_child,
             :tag_order,
             :search_highlight,
             :search_operator,
             :search_exact
end
