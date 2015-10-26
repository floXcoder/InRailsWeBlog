json.tags do
  json.array! tags do |tag|
    json.id         tag.id
    json.tagger_id  tag.tagger_id
    json.name       tag.name.capitalize

    json.children   tag.children, :id
  end
end
