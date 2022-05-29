# frozen_string_literal: true

# Configure sensitive parameters which will be filtered from the log file.
Rails.application.config.filter_parameters += [
  :password, :summary, :summary_translations, :content, :content_translations, :description, :description_translations, :body, :passw, :secret, :token, :_key, :crypt, :salt, :certificate, :otp, :ssn
]
