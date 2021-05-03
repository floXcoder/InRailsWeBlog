# frozen_string_literal: true

# == Schema Information
#
# Table name: seo_datas
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  locale     :string           not null
#  parameters :string           default([]), not null, is an Array
#  page_title :jsonb            not null
#  meta_desc  :jsonb            not null
#  languages  :string           default([]), not null, is an Array
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do
  factory :seo_data, class: 'Seo::Data' do

    name          { Faker::Lorem.sentence }
    parameters    { [] }
    page_title    { {en: Faker::Lorem.sentence} }
    meta_desc     { { en: Faker::Lorem.paragraph(sentence_count: 1)} }
    locale        { 'en' }
    languages     { ['en'] }

  end
end
