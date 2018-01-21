# == Schema Information
#
# Table name: tagged_articles
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  topic_id   :integer          not null
#  tag_id     :integer          not null
#  article_id :integer          not null
#  parent     :boolean          default(FALSE), not null
#  child      :boolean          default(FALSE), not null
#  deleted_at :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do

  factory :tagged_article do
    # tag
    # article
  end

end
