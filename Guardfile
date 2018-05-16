# Limit directory being watched
directories %w[app db config frontend lib spec]
# Clear console when launching guard
clearing :on
# Display notification in OS
# notification :libnotify, timeout: 5, transient: true, append: false, urgency: :critical
notification :off
# Don't display a pry console
interactor :off

guard 'migrate' do
  watch(%r{^db/migrate/(\d+).+\.rb})
end

guard 'process', name: 'i18n-js', command: 'rails i18n:js:export' do
  watch(%r{^config/i18n-js\.yml})
  watch(%r{^config/locales/js\..+\.yml})
end

# Option "force_run: true" does not work on Windows
guard :rails, server: :puma, port: 3000, timeout: 60 do
  # watch(%r{^Gemfile\.lock$})
  watch(%r{^app/mailers/.+\.rb})
  watch(%r{^app/uploaders/.+\.rb})
  # watch(%r{^app/workers/.+\.rb})
  watch(%r{^config/.+(?<!locales)/.*})
  watch(%r{^config/*/[^.][^/]+\.(rb|yml)(?<!i18n-js\.yml)})
  watch(%r{^lib/.*})
end

guard 'process', name: 'Webpack', command: 'npm run development' do
  watch(%r{^frontend/.+\.js$})
end

guard 'sidekiq', environment: 'development' do
  watch(%r{^app/workers/.+\.rb})
  watch(%r{^app/mailers/.+\.rb})
  watch(%r{^config/initializers/sidekiq\.rb})
  watch(%r{^config/sidekiq\.yml})
end

guard 'annotate', routes: false do
  watch(%r{^db/schema\.rb})
  # watch(%r{^app/models/.+\.rb$})
end

# Not watching root files
# guard :bundler do
#   watch(%r{^Gemfile$})
# end

# Not watching root files
# guard 'process', name: 'NPM packages', command: 'yarn' do
#   watch(%r{^package\.json$})
# end
