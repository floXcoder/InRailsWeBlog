# frozen_string_literal: true

RSpec.configure do |config|
  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)

    Searchkick.disable_callbacks
  end

  config.before(:all) do
    DatabaseCleaner.strategy = :transaction
  end

  config.before(:all) do
    DatabaseCleaner.start
  end

  config.around(:each, search: true) do |example|
    Searchkick.enable_callbacks
    example.run
    Searchkick.disable_callbacks
  end

  config.around do |example|
    expect {
      example.run
    }.not_to raise_exception
  end

  # config.before(:each, type: :feature) do
  #   resize_window_to_default
  # end

  config.after(:all) do
    DatabaseCleaner.clean
  end
end
