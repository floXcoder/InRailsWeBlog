json.preferences do
  json.article_display      user.read_preference(:article_display)
  json.search_operator      user.read_preference(:search_operator)
  json.search_exact         user.read_preference(:search_exact)
  json.search_highlight     user.read_preference(:search_highlight)
end

