SimpleConfig.for :application do
  # Maximum upload image size
  set :image_size, 5.megabytes

  set :per_page, 10

  set :title_min_length, 3
  set :title_max_length, 128
  set :summary_min_length, 3
  set :summary_max_length, 256
  set :content_min_length, 3
  set :content_max_length, 8_000_000

  set :tag_min_length, 1
  set :tag_max_length, 32
end
