# Limit directory being watched
# if used, root files are not watched anymore
# directories %w[app db config frontend lib]
ignore %r{^bin/}, %r{^node_modules/}, %r{^public/}, %r{^spec/}, %r{^tmp/}, %r{^vendor/}

# # Clear console when launching guard
clearing :on
# # Display notification in OS
# # notification :libnotify, timeout: 5, transient: true, append: false, urgency: :critical
notification :off
# # Don't display a pry console
interactor :off

## Guard processes
guard :process, name: 'i18n-js', command: 'i18n export' do
  watch('config/i18n-js.yml')
  watch(%r{^config/locales/js\..+\.yml})
end

guard :process, name: 'rails', command: 'rails server -p 3000' do
  watch('Gemfile.lock')
  watch(%r{^app/mailers/.+\.rb})
  watch(%r{^app/uploaders/.+\.rb})
  watch(%r{^config/.+(?<!locales)/.*})
  watch(%r{^config/*/[^.][^/]+\.(rb|yml)(?<!i18n-js\.yml)})
  watch(%r{^lib/.+(?<!tasks)/.*})
end

guard :process, name: 'Webpack', command: 'npm run development' do
  watch('yarn.lock')
  watch(%r{^frontend/.+\.cjs$})
end

guard :sidekiq, environment: 'development' do
  watch('config/initializers/sidekiq.rb')
  watch('config/sidekiq.yml')
  watch(%r{^app/workers/.+\.rb})
  watch(%r{^app/mailers/.+\.rb})
end

guard :process, name: 'Annotate', command: 'annotate --models' do
  watch('db/schema.rb')
end
