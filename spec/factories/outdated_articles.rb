# == Schema Information
#
# Table name: outdated_articles
#
#  id         :integer          not null, primary key
#  article_id :integer          not null
#  user_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do

  factory :outdated_article do
    # user
    # article
  end

end
