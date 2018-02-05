# == Schema Information
#
# Table name: settings
#
#  id         :integer          not null, primary key
#  var        :string           not null
#  value      :text
#  thing_id   :integer
#  thing_type :string(30)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class SettingSerializer < ActiveModel::Serializer
  cache key: 'settings', expires_in: 12.hours

  attributes :articles_loader,
             :article_display,
             :search_highlight,
             :search_operator,
             :search_exact
end
