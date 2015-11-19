SimpleConfig.for :application do
  # Default user preferences
  set :article_display,   'card'
  set :multi_language,    false
  set :search_highlight,  true
  set :search_operator,   'and'
  set :search_exact,      true

  # Maximum upload image size
  set :image_size, 5.megabytes

  # Articles per page
  set :per_page, 10

  # Articles properties
  set :title_min_length,    3
  set :title_max_length,    128
  set :summary_min_length,  3
  set :summary_max_length,  256
  set :content_min_length,  3
  set :content_max_length,  8_000_000

  # Tag properties
  set :tag_min_length, 1
  set :tag_max_length, 32
end
