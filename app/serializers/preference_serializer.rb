# == Schema Information
#
# Table name: preferences
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  name       :string           not null
#  value      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class PreferenceSerializer < ActiveModel::Serializer
  attributes :article_display,
             :search_operator,
             :search_exact,
             :search_highlight

  def article_display
    object.preferences[:article_display]
  end

  def search_operator
    object.preferences[:search_operator]
  end

  def search_exact
    object.preferences[:search_exact]
  end

  def search_highlight
    object.preferences[:search_highlight]
  end
end
