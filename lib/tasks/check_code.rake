# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:check_code
  desc "Check code doesn't contain log trace"
  task :check_code do |_task, _args|
    # Check ruby files
    Dir.glob(Rails.root.join('{app,config}/**/*.rb').to_s).each do |file|
      if File.readlines(file).grep(/ w +/).any?
        fail "Ruby file contain a log trace: #{file}"
      end
    end

    # Check JS files
    Dir.glob(Rails.root.join('app/assets/javascripts/**/*.{js,jsx}').to_s).each do |file|
      next unless File.readlines(file).grep(/console\.log\(/).any? ||
        File.readlines(file).grep(/log\.info\(/).any? ||
        File.readlines(file).grep(/[\W]w\(/).any? ||
        File.readlines(file).grep(/[\W]\{w\(/).any?

      fail "Javascript file contain a log trace: #{file}"
    end
  end
end
