json.articles do
  json.array! articles do |article|
    json.id       article.id
    json.author   article.author.pseudo
    json.title    article.title
    json.summary  article.summary
    json.content  article.content
    json.tags do
      json.array! article.tags.pluck(:id, :name) do |tag|
        json.id   tag[0]
        json.name tag[1]
      end
    end
    json.show     true
  end
end

unless tags.empty?
  json.tags do
    json.array! tags do |tag|
      json.id   tag[0]
      json.name tag[1]
    end
  end
end

