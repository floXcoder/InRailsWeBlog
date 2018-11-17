# frozen_string_literal: true

# Global static variables
# Dynamic variables are defined in: config/app.yml
SimpleConfig.for :application do
  # Global
  set :website_name, ENV['WEBSITE_NAME']
  set :website_email, ENV['WEBSITE_EMAIL']

  # Cache time
  set :cache_time, 12.hours

  # User validation parameters
  set :user_pseudo_min_length, 3
  set :user_pseudo_max_length, 60
  set :user_email_min_length, 5
  set :user_email_max_length, 128
  set :user_password_min_length, 8
  set :user_password_max_length, 128

  # Topic validation parameters
  set :topic_name_min_length, 1
  set :topic_name_max_length, 128
  set :topic_description_min_length, 3
  set :topic_description_max_length, 3_000

  # Article validation parameters
  set :article_title_min_length, 1
  set :article_title_max_length, 128
  set :article_summary_min_length, 3
  set :article_summary_max_length, 256
  set :article_content_min_length, 3
  set :article_content_max_length, 8_000_000

  # Tag validation parameters
  set :tag_name_min_length, 1
  set :tag_name_max_length, 52
  set :tag_description_min_length, 3
  set :tag_description_max_length, 3_000

  # Comment validation parameters
  set :comment_title_min_length, 1
  set :comment_title_max_length, 256
  set :comment_body_min_length, 1
  set :comment_body_max_length, 1_024

  # Notation validation parameters
  set :notation_min, 0
  set :notation_max, 5
end
