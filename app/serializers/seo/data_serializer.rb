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
class Seo::DataSerializer
  include FastJsonapi::ObjectSerializer

  set_type :seo_data

  set_key_transform :camel_lower

  attributes :id,
             :name,
             :locale,
             :parameters,
             :page_title,
             :meta_desc

  attribute :parameters do |object|
    if object.parameters.present?
      (object.parameters + (Seo::Data.associated_parameters[object.parameters.last.to_sym] || [])).compact.map(&:to_s).uniq
    else
      []
    end
  end

  attribute :visibility do |object, params|
    if params[:routes]
      params[:routes].find { |route| route.name == object.name }&.params&.dig(:public) || false
    end
  end

end
