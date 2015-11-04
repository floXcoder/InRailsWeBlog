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

  attributes :article_display, :multi_language, :search_operator, :search_exact

  def article_display
    object.read_preference(:article_display)
  end

  def multi_language
    object.read_preference(:multi_language)
  end

  def search_operator
    object.read_preference(:search_operator)
  end

  def search_exact
    object.read_preference(:search_exact)
  end

  def search_highlight
    object.read_preference(:search_highlight)
  end

end
