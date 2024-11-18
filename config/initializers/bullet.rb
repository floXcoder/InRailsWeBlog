# frozen_string_literal: true

if Rails.env.development?
  require 'bullet'

  # N 1 Queries
  Bullet.enable               = false
  Bullet.alert                = false
  Bullet.bullet_logger        = false
  Bullet.console              = false
  Bullet.rails_logger         = true
  Bullet.add_footer           = false
  Bullet.counter_cache_enable = true
end
