# Be sure to restart your server when you modify this file.

# Add new mime types for use in respond_to blocks:
# Mime::Type.register "text/richtext", :rtf

InRailsWeBlog::Application.configure do
  # Correct header detection
  config.middleware.use GoogleBotAware
end
