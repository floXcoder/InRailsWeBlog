json.articles do
  json.array! articles do |article|
    content = article.adapted_content(current_user_id, local_assigns[:highlight] ? highlight[article.id] : nil)
    next unless content

    json.id         article.id
    json.author     article.author.pseudo
    json.title      article.title
    json.summary    article.summary
    json.content    content
    json.visibility article.visibility
    json.is_link    article.is_link
    json.show       true

    json.tags do
      json.array! article.tags.pluck(:id, :name) do |tag|
        json.id   tag[0]
        json.name tag[1]
      end
    end

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

