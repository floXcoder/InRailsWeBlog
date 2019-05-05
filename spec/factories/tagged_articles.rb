# frozen_string_literal: true

# == Schema Information
#
# Table name: tagged_articles
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  topic_id   :bigint           not null
#  tag_id     :bigint           not null
#  article_id :bigint           not null
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
