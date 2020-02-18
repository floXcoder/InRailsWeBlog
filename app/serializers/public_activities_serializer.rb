# frozen_string_literal: true

class PublicActivitiesSerializer
  include FastJsonapi::ObjectSerializer

  set_key_transform :camel_lower

  attributes :id,
             :trackable_id,
             :trackable_type,
             :key,
             :parameters,
             :recipient_id,
             :recipient_type

  attribute :performed_at do |object|
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  attribute :link do |object|
    if object.trackable_type == 'Article'
      Rails.application.routes.url_helpers.article_path(object.trackable_id)
    elsif object.trackable_type == 'Tag'
      Rails.application.routes.url_helpers.tag_path(object.trackable_id)
    elsif object.trackable_type == 'TaggedArticle'
      Rails.application.routes.url_helpers.article_path(object.recipient_id)
    elsif object.trackable_type == 'BookmarkedArticle'
      Rails.application.routes.url_helpers.article_path(object.recipient_id)
    elsif object.trackable_type == 'Comment'
      url_for(
        controller: object.recipient_type.tableize,
        action: 'show',
        id: object.recipient_id,
        anchor: "comment-#{object.trackable_id}",
        only_path: true
      )
    end
  end
end
