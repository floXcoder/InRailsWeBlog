# frozen_string_literal: true

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

  attribute :visibility do |object, params|
    if params[:routes]
      params[:routes].find { |route| route.name == object.name }&.params&.dig(:public) || false
    end
  end

end
