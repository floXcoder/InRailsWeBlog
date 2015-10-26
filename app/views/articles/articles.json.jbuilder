json.articles do
  json.array! articles do |article|
    content = article.adapted_content(current_user_id, local_assigns[:highlight] ? highlight[article.id] : nil)
    next unless content

    json.id         article.id
    json.slug       article.slug
    json.author     article.author.pseudo
    json.author_id  article.author.id
    json.title      article.title
    json.summary    article.summary
    json.content    content
    json.visibility article.visibility
    json.is_link    article.is_link
    json.show       true

    json.tags         article.tags, :id, :tagger_id, :name
    json.parent_tags  article.parent_tags, :id, :tagger_id, :name
    json.child_tags   article.child_tags, :id, :tagger_id, :name

    if local_assigns[:highlight] && highlight[article.id]
      json.highlight_content highlight[article.id][:content]
    end
  end
end

if local_assigns[:suggestions] && !suggestions.empty?
  json.suggestions suggestions
end

if local_assigns[:tags] && !tags.empty?
  json.tags do
    json.array! tags do |tag|
      json.id   tag[0]
      json.name tag[1]
    end
  end
end

