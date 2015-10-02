namespace :InRailsWeBlog do

  namespace :static_analysis do
    desc 'Code coverage with rspec'
    task rspec_coverage: :environment do
      Rails.env = 'test'

      require 'rspec/core/rake_task'

      ENV['COVERAGE'] = 'true'

      RSpec::Core::RakeTask.new(:spec) do |t|
        t.pattern = Dir.glob('spec/**/*_spec.rb')
        t.rspec_opts = ' --require rails_helper'
        t.rspec_opts << ' --format h'
        t.rspec_opts << ' --options .rspec_coverage'
        t.rspec_opts << ' --out static_analysis/rspec.html'
      end

      Rake.application.invoke_task('spec')
      %x{mv #{Rails.root}/static_analysis/index.html #{Rails.root}/static_analysis/code_coverage.html}
    end

    desc 'Rails Best Practices'
    task best_pratices: :environment do
      Rails.env = 'test'

      %x{mkdir -p static_analysis && rails_best_practices -f html --output-file static_analysis/rails_best_practices.html --with-git --silent --spec .}
    end

    desc 'Rubocop'
    task rubocop: :environment do
      Rails.env = 'test'

      require 'rubocop'
      cli = RuboCop::CLI.new
      cli.run(%w(--rails --format html -o static_analysis/rubocop.html))
    end

    desc 'Brakeman'
    task brakeman: :environment do
      Rails.env = 'test'

      require 'brakeman'

      output_file = ['static_analysis/brakeman.html']
      Brakeman.run app_path: Rails.root, output_files: output_file, print_report: true
    end

    desc 'Metric_fu'
    task metric_fu: :environment do
      Rails.env = 'test'

      %x{metric_fu --format html --out #{Rails.root}/static_analysis/metric_fu --no-open --no-rcov --no-rails-best-practices}
      %x{rm #{Rails.root}/static_analysis/metric_fu.html}
      %x{ln -s #{Rails.root}/static_analysis/metric_fu/index.html #{Rails.root}/static_analysis/metric_fu.html}
    end

    desc 'i18n'
    task i18n: :environment do
      Rails.env = 'test'

      %x{i18n-tasks health > #{Rails.root}/static_analysis/i18n.txt}
    end

    desc 'Find unused CSS. IMPORTANT: Rails server must be running on port 3000.'
    task unused_CSS: :environment do
      require 'deadweight'

      dw = Deadweight.new
      dw.root = 'http://localhost:3000'

      dw.stylesheets = %w( /assets/application.css /assets/home/home.css )
      dw.pages = %w( / /rides /outings )

      static_path = Rails.root.join('static_analysis')
      FileUtils.mkdir_p(static_path) unless File.directory?(static_path)

      output_file = Rails.root.join('static_analysis', 'unused_css.txt')
      File.open(output_file, 'w') { |file| file.write dw.run }
    end

    desc 'Generate all reports'
    # task all: [:best_pratices, :rubocop, :brakeman, :rspec_coverage, :metric_fu, :i18n, :unused_CSS]
    task all: [:best_pratices, :rubocop, :brakeman, :rspec_coverage, :metric_fu, :i18n]
  end
end
