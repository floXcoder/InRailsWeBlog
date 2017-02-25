# == Schema Information
#
# Table name: tags
#
#  id                    :integer          not null, primary key
#  user_id             :integer          not null
#  name                  :string           not null
#  description           :text
#  synonyms              :string           default([]), is an Array
#  color                 :string
#  priority              :integer          default(0), not null
#  visibility            :integer          default(0), not null
#  archived              :boolean          default(FALSE), not null
#  accepted              :boolean          default(TRUE), not null
#  tagged_articles_count :integer          default(0)
#  slug                  :string
#  deleted_at            :datetime
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

FactoryGirl.define do

  factory :tag do
    # user

    sequence(:name)         { |n| "Tag #{n}" }
    sequence(:description)  { |n| "Tag description #{n}" }
    priority                0
    visibility              'everyone'
  end

end
