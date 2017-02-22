namespace :InRailsWeBlog do
  namespace :static_analysis do
    desc 'Rails Best Practices'
    task best_pratices: :environment do
      Rails.env = 'test'

      output_file = Rails.root.join('static_analysis', 'rails_best_practices.html')
      %x{mkdir -p static_analysis && rails_best_practices -f html --output-file #{output_file} --with-git --silent --spec .}
    end

    desc 'Rubocop'
    task rubocop: :environment do
      Rails.env = 'test'

      require 'rubocop'
      cli = RuboCop::CLI.new
      output_file = Rails.root.join('static_analysis', 'rubocop.html')
      cli.run(%W(--rails --format html -o #{output_file} --display-cop-names --extra-details --fail-level warning --except Style,Metrics))
    end

    desc 'Brakeman'
    task brakeman: :environment do
      Rails.env = 'test'

      require 'brakeman'

      output_file = ['static_analysis/brakeman.html']
      Brakeman.run app_path: Rails.root, output_files: output_file, print_report: true
    end

    # Flog : not working
    desc 'Metric_fu'
    task metric_fu: :environment do
      Rails.env = 'test'

      output_file = Rails.root.join('static_analysis', 'metric_fu.html')
      %x{metric_fu --format html --out #{Rails.root}/static_analysis/metric_fu --no-open --no-rcov --no-rails-best-practices --no-flog}
      %x{rm #{Rails.root}/static_analysis/metric_fu.html}
      %x{ln -s #{Rails.root}/static_analysis/metric_fu/index.html #{output_file}}
    end

    desc 'Generate all reports'
    task all: [:best_pratices, :rubocop, :brakeman, :metric_fu]

    # I18n integrated into rspec tests
    # desc 'i18n'
    # task i18n: :environment do
    #   Rails.env = 'test'
    #
    #   output_file = Rails.root.join('static_analysis', 'i18n.html')
    #   %x{i18n-tasks missing > #{output_file}}
    # end

    # desc 'Code coverage with rspec'
    # task rspec_coverage: :environment do
    #   Rails.env = 'test'
    #
    #   require 'rspec/core/rake_task'
    #
    #   ENV['COVERAGE'] = 'true'
    #
    #   RSpec::Core::RakeTask.new(:spec) do |t|
    #     t.pattern = Dir.glob('spec/**/*_spec.rb')
    #     t.rspec_opts = ' --require rails_helper'
    #     t.rspec_opts << ' --format h'
    #     t.rspec_opts << ' --options .rspec_coverage'
    #     t.rspec_opts << ' --out static_analysis/rspec.html'
    #   end
    #
    #   begin
    #     Rake.application.invoke_task('spec')
    #   ensure
    #     output_file = Rails.root.join('static_analysis', 'code_coverage.html')
    #     %x{mv #{Rails.root}/static_analysis/index.html #{output_file}}
    #   end
    # end

    # Not used : too many gems installed
    # desc 'Dawn'
    # task dawn: :environment do
    #   # require 'dawn/tasks'
    #   # Rake.application.invoke_task('dawn:run')
    #
    #   output_file = Rails.root.join('static_analysis', 'dawn.html')
    #   %x{dawn --html -F #{output_file} .}
    # end
  end
end
