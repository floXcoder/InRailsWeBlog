# frozen_string_literal: true

class Admin::VisitSerializer
  include FastJsonapi::ObjectSerializer

  set_type :visit

  set_key_transform :camel_lower

  attributes :id,
             :user_id,
             :ip,
             :referrer,
             :landing_page,
             :takeoff_page,
             :browser,
             :os,
             :device_type,
             :country

  attribute :started_at do |object|
    I18n.l(object.started_at, format: :custom).mb_chars.downcase.to_s
  end

  attribute :ended_at do |object|
    I18n.l(object.ended_at, format: :custom).mb_chars.downcase.to_s
  end

  attribute :user do |object|
    UserSerializer.new(object.user).serializable_hash[:data][:attributes] if object.user
  end

  attribute :events do |object|
    object.events.map do |event|
      {
        id:         event.id,
        name:       event.name,
        properties: event.properties,
        time:       I18n.l(event.time, format: :custom).mb_chars.downcase.to_s
      }
    end
  end

end
