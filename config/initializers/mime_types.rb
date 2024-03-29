# frozen_string_literal: true

# Add new mime types for use in respond_to blocks:
# Mime::Type.register "text/richtext", :rtf

Mime::Type.register 'application/zip', :zip

Mime::Type.register 'application/json', :json, %w[application/json application/cloudevents+json]
