class PublicActivitiesSerializer < ActiveModel::Serializer
  cache key: 'public_activities', expires_in: 12.hours

  attributes :id,
             :trackable_id,
             :trackable_type,
             :key,
             :parameters,
             :recipient_id,
             :recipient_type,
             :performed_at,
             :link

  def performed_at
    I18n.l(object.created_at, format: :custom).downcase
  end

  include Rails.application.routes.url_helpers

  def link
    if object.trackable_type == 'Article'
      article_path(object.trackable_id)
    elsif object.trackable_type == 'Tag'
      tag_path(object.trackable_id)
    elsif object.trackable_type == 'TaggedArticle'
      article_path(object.recipient_id)
    elsif object.trackable_type == 'BookmarkedArticle'
      article_path(object.recipient_id)
    elsif object.trackable_type == 'Comment'
      article_path(object.recipient_id) + '#comment-' + object.trackable_id.to_s
    else
      nil
    end
  end

end
