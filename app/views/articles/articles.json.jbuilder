json.articles do
  json.array! articles do |article|
    if article.private_content
      if local_assigns[:current_user_id] && (article.author.id == current_user_id)
        json.content  article.content
      else
        if local_assigns[:words] && words.any? { |word| article.public_content.match(word) }
          json.content  article.public_content
        else
          next
        end
      end
    else
      json.content  article.content
    end

    json.id         article.id
    json.author     article.author.pseudo
    json.title      article.title
    json.summary    article.summary
    json.visibility article.visibility
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

