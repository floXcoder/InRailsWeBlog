RSpec.configure do |config|
  config.before(:suite) do
    # DatabaseCleaner.clean_with(:transaction)
    DatabaseCleaner.clean_with(:truncation)

    Searchkick.disable_callbacks
  end

  config.before(:all, basic: true) do
    DatabaseCleaner.start
  end

  config.around(:each, search: true) do |example|
    Searchkick.enable_callbacks
    example.run
    Searchkick.disable_callbacks
  end

  # config.before(:each, type: :feature) do
  #   resize_window_to_default
  # end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    Warden.test_reset!
    DatabaseCleaner.clean
  end

  config.after(:all, js: true) do
    Warden.test_reset!
    Capybara.reset_sessions!
  end

  config.after(:all) do
    DatabaseCleaner.clean
  end
end
