# frozen_string_literal: true

class HistorySerializer
  include FastJsonapi::ObjectSerializer

  set_key_transform :camel_lower

  attributes :id,
             :changeset

  attribute :changed_at do |object|
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  attribute :article do |object|
    object.reify
  end
end
