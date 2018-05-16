# == Schema Information
#
# Table name: tagged_articles
#
#  id         :bigint(8)        not null, primary key
#  user_id    :bigint(8)        not null
#  topic_id   :bigint(8)        not null
#  tag_id     :bigint(8)        not null
#  article_id :bigint(8)        not null
#  parent     :boolean          default(FALSE), not null
#  child      :boolean          default(FALSE), not null
#  deleted_at :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do

  factory :tagged_article do
    # user
    # topic

    # tag
    # article
  end

end
