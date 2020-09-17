# frozen_string_literal: true

require 'support/helpers/sidekiq_helpers'
require 'support/helpers/responsive_helpers'

RSpec.configure do |config|
  config.include Features::SidekiqHelpers,    type: :feature
  config.include Features::ResponsiveHelpers, type: :feature
  config.include ApplicationHelper
end
