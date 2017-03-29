class SettingSerializer < ActiveModel::Serializer
  cache key: 'settings', expires_in: 12.hours

  attributes :article_display,
             :search_highlight,
             :search_operator,
             :search_exact
end
