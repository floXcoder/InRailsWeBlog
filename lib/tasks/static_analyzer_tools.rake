# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:static_analysis:all

  # rails InRailsWeBlog:static_analysis:best_practices
  # rails InRailsWeBlog:static_analysis:rubocop
  # rails InRailsWeBlog:static_analysis:eslint
  # rails InRailsWeBlog:static_analysis:rspec_coverage

  namespace :static_analysis do
    desc 'Rails Best Practices'
    task best_practices: :environment do
      Rails.env = 'test'

      output_file = Rails.root.join('static_analysis', 'rails_best_practices.html')
      %x(mkdir -p static_analysis && rails_best_practices -f html --output-file #{output_file} --silent --spec .)
    end

    desc 'Rubocop'
    task rubocop: :environment do
      Rails.env = 'test'

      require 'rubocop'
      cli         = RuboCop::CLI.new
      output_file = Rails.root.join('static_analysis', 'rubocop.html')
      cli.run(%W[--display-cop-names --extra-details --fail-level convention --except Metrics --format html -o #{output_file}])
    end

    desc 'Javascript ESLint'
    task eslint: :environment do
      output_file = Rails.root.join('static_analysis', 'eslint.html')
      %x(node #{Rails.root}/node_modules/eslint/bin/eslint.js -o #{output_file} -f html -c #{Rails.root}/eslint.config.mjs app/assets/javascripts)
    end

    desc 'Stylelint'
    task stylelint: :environment do
      output_file = Rails.root.join('static_analysis', 'stylelint.txt')
      %x(npx stylelint -c .stylelintrc.json -o #{output_file} "**/*.scss")
    end

    desc 'Code coverage for Rails tests'
    task rspec_coverage: :environment do
      Rails.env = 'test'

      require 'rspec/core/rake_task'

      ENV['COVERAGE'] = 'true'

      RSpec::Core::RakeTask.new(:spec) do |t|
        t.pattern    = Dir.glob('spec/**/*_spec.rb')
        t.rspec_opts = '--options .rspec_coverage'
      end

      begin
        Rake.application.invoke_task('spec')
      ensure
        generated_file = "#{Rails.root}/static_analysis/index.html"
        output_file    = Rails.root.join('static_analysis', 'code_coverage.html')
        %x(mv #{Rails.root}/static_analysis/rspec_results.html #{output_file}) if File.exist?(generated_file)
      end
    end

    # desc 'Find database indexes'
    # task find_database_indexes: :environment do
    #   Rails.env = 'test'
    #
    #   output_file = Rails.root.join('static_analysis', 'db_indexes.html')
    #   %x(lol_dba db:find_indexes > #{output_file})
    #   %x(rake inspect_unique_validations >> #{output_file})
    # end

    desc 'Generate all reports'
    task all: [:best_practices, :rubocop, :eslint, :stylelint, :rspec_coverage]
  end
end
