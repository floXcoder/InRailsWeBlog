json.article_versions do
  json.array! article_versions do |version|

    json.id         version.id
    json.changed_at format_datetime(version.created_at).downcase
    json.object     version.reify
    json.changeset  version.changeset

    # content = article.adapted_content(current_user_id, local_assigns[:highlight] ? highlight[article.id] : nil)
    # next unless content
    # json.content    content
  end
end
