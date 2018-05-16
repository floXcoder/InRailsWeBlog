# == Schema Information
#
# Table name: outdated_articles
#
#  id         :bigint(8)        not null, primary key
#  user_id    :bigint(8)        not null
#  article_id :bigint(8)        not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do

  factory :outdated_article do
    # user
    # article
  end

end
