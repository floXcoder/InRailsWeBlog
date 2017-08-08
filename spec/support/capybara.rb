Capybara.run_server = true

Capybara.app_host = 'http://localhost:3020'
Capybara.server_host = 'localhost'
Capybara.server_port = '3020'
Capybara.configure do |config|
  config.default_host = 'http://localhost:3020'
end

# Capybara.register_driver :selenium_chrome do |app|
#   Capybara::Selenium::Driver.new(app, browser: :chrome, args: ['--window-size=1920x1080'])
# end
# Capybara.javascript_driver = :selenium_chrome

Capybara.register_driver :headless_chrome do |app|
  Capybara::Selenium::Driver.new(app, browser: :chrome, args: ['headless', '--window-size=1920x1080'])
  # options = Selenium::WebDriver::Chrome::Options.new
  # options.add_argument('headless')
  # options.add_argument('--window-size=1920x1080')
end
Capybara.javascript_driver = :headless_chrome

Capybara.configure do |config|
  config.default_max_wait_time = 10 # seconds
end

# class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
#   driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
# end
