SimpleConfig.for :application do
  set :website_name, ENV['WEBSITE_NAME']
  set :website_email, ENV['WEBSITE_EMAIL']

  # Screen size
  set :small_screen_up, 601
  set :medium_screen_up, 993
  set :large_screen_up, 1201
  set :small_screen, 600
  set :medium_screen, 992
  set :large_screen, 1200

  # Cache time
  set :cache_time, 2.hours

  # Maximum upload image size
  set :image_size, 8.megabytes

  # Default per page
  set :per_page, 12

  # User validation parameters
  set :user_pseudo_min_length, 3
  set :user_pseudo_max_length, 60
  set :user_email_min_length, 5
  set :user_email_max_length, 128
  set :user_password_min_length, 8
  set :user_password_max_length, 128

  # Default user preferences
  set :article_display, 'card'
  set :search_highlight, true
  set :search_operator, 'and'
  set :search_exact, true

  # Article validation parameters
  set :article_title_min_length, 3
  set :article_title_max_length, 128
  set :article_summary_min_length, 3
  set :article_summary_max_length, 256
  set :article_content_min_length, 3
  set :article_content_max_length, 8_000_000

  # Comment validation parameters
  set :comment_title_min_length, 1
  set :comment_title_max_length, 256
  set :comment_body_min_length, 1
  set :comment_body_max_length, 1_024

  # Notation validation parameters
  set :notation_min, 0
  set :notation_max, 5

  # Tag validation parameters
  set :tag_min_length, 1
  set :tag_max_length, 32
end
