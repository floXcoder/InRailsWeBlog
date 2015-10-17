# == Schema Information
#
# Table name: tagged_articles
#
#  id         :integer          not null, primary key
#  article_id :integer
#  tag_id     :integer
#  parent     :boolean          default(FALSE), not null
#  child      :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  factory :tagged_article do
    
  end

end
