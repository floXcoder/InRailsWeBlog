# frozen_string_literal: true
# == Schema Information
#
# Table name: tagged_articles
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  topic_id   :integer          not null
#  tag_id     :integer          not null
#  article_id :integer          not null
#  parent     :boolean          default("false"), not null
#  child      :boolean          default("false"), not null
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
