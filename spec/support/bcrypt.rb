# frozen_string_literal: true

require 'bcrypt'

# Optimize tests
silence_warnings do
  # Make bcrypt unsecure but fast in tests
  BCrypt::Engine::DEFAULT_COST = BCrypt::Engine::MIN_COST
end
