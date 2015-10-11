json.articles do
  json.array! articles do |article, details|
    json.id       article.id
    json.author   article.author.pseudo
    json.title    article.title
    json.summary  article.summary
    json.content  article.content
    json.visibility  article.visibility

    json.tags do
      json.array! article.tags.pluck(:id, :name) do |tag|
        json.id   tag[0]
        json.name tag[1]
      end
    end

    json.show     true

    if details
      json.highlight_content details[:highlight][:content] if details[:highlight] && details[:highlight][:content]
    end
  end
end

if local_assigns[:suggestions] && !suggestions.empty?
  json.suggestions  suggestions
end

unless tags.empty?
  json.tags do
    json.array! tags do |tag|
      json.id   tag[0]
      json.name tag[1]
    end
  end
end

