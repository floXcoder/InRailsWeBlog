# frozen_string_literal: true

require 'premailer/rails'

Premailer::Rails.config.merge!(
  input_encoding:     'UTF-8',
  generate_text_part: true
)
