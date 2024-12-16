# frozen_string_literal: true

class ApplicationJob < ActiveJob::Base
  retry_on Net::OpenTimeout, Timeout::Error, wait: :polynomially_longer, attempts: 2

end
