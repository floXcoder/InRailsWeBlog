SimpleConfig.for :application do
  # Screen size
  set :small_screen_up, 601
  set :medium_screen_up, 993
  set :large_screen_up, 1201
  set :small_screen, 600
  set :medium_screen, 992
  set :large_screen, 1200

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

  # User validation parameters
  set :user_pseudo_min_length, 3
  set :user_pseudo_max_length, 60
  set :user_email_min_length, 5
  set :user_email_max_length, 128
  set :user_password_min_length, 8
  set :user_password_max_length, 128

  # Article validation parameters
  set :title_min_length,    3
  set :title_max_length,    128
  set :summary_min_length,  3
  set :summary_max_length,  256
  set :content_min_length,  3
  set :content_max_length,  8_000_000

  # Tag validation parameters
  set :tag_min_length, 1
  set :tag_max_length, 32
end
