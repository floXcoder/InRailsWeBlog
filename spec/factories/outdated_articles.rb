# frozen_string_literal: true
# == Schema Information
#
# Table name: outdated_articles
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  article_id :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do

  factory :outdated_article do
    # user
    # article
  end

end
