# Limit directory being watched
directories %w(app db config lib spec test)
# Clear console when launching guard
clearing :on
# Display notification in OS
# notification :libnotify, timeout: 5, transient: true, append: false, urgency: :critical
notification :off
# Don't display a pry console
interactor :off

guard :bundler do
  watch('Gemfile')
end

guard 'migrate' do
  watch(%r{^db/migrate/(\d+).+\.rb})
  watch('db/seeds.rb')
end

guard 'sidekiq', environment: 'development' do
  watch(%r{^app/workers/.+\.rb})
  watch(%r{^app/mailers/.+\.rb})
end

# Option "force_run: true" does not work on Windows
guard 'rails', server: :thin, port: 3001, timeout: 60 do
  watch('Gemfile.lock')
  watch(%r{^config/.+(?<!locales)/.*})
  watch(%r{^config/*/[^.][^/]+\.(rb|yml)(?<!breadcrumbs\.rb)})
  watch(%r{^lib/.*})
  watch(%r{^app/workers/.+\.rb})
  watch(%r{^app/mailers/.+\.rb})
end

guard 'process', name: 'Gulp', command: 'gulp' do
  watch('app/frontend/**/*.js')
end

guard 'annotate', routes: true do
  watch('db/schema.rb')
  watch('app/models/**/*.rb')
end

# guard :rspec, cmd: 'spring rspec --format Fuubar --color --require spec_helper' do
#   watch(%r{^spec/.+_spec\.rb$})
#   watch(%r{^lib/(.+)\.rb$})     { |m| "spec/lib/#{m[1]}_spec.rb" }
#   watch('spec/spec_helper.rb')  { 'spec' }
#
#   # Rails example
#   watch(%r{^app/(.+)\.rb$})                           { |m| "spec/#{m[1]}_spec.rb" }
#   watch(%r{^app/(.*)(\.erb|\.haml|\.slim)$})          { |m| "spec/#{m[1]}#{m[2]}_spec.rb" }
#   watch(%r{^app/controllers/(.+)_(controller)\.rb$})  { |m| %W(spec/routing/#{m[1]}_routing_spec.rb spec/#{m[2]}s/#{m[1]}_#{m[2]}_spec.rb spec/acceptance/#{m[1]}_spec.rb) }
#   watch(%r{^spec/support/(.+)\.rb$})                  { 'spec' }
#   watch(%r{^spec/mailers/(.+)\.rb$})                  { 'spec' }
#   watch('config/routes.rb')                           { 'spec/routing' }
#   watch('app/controllers/application_controller.rb')  { 'spec/controllers' }
#   watch('spec/rails_helper.rb')                       { 'spec' }
#
#   # Capybara features specs
#   watch(%r{^app/views/(.+)/.*\.(erb|haml|slim)$})     { |m| "spec/features/#{m[1]}_spec.rb" }
#
#   # Turnip features and steps
#   watch(%r{^spec/acceptance/(.+)\.feature$})
#   watch(%r{^spec/acceptance/steps/(.+)_steps\.rb$})   { |m| Dir[File.join("**/#{m[1]}.feature")][0] || 'spec/acceptance' }
# end
