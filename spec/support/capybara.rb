Capybara.run_server = true

Capybara.app_host = 'http://localhost:3020'
Capybara.server_host = 'localhost'
Capybara.server_port = '3020'
Capybara.configure do |config|
  config.default_host = 'http://localhost:3020'
end

Capybara.javascript_driver = :webkit

Capybara::Webkit.configure do |config|
  config.block_unknown_urls
end
