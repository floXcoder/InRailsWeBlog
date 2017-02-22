Devise.setup do |config|
  # The secret key used by Devise.
  config.secret_key = ENV['DEVISE_SECRET_KEY']

  # ==> Mailer Configuration
  config.mailer_sender = ENV['EMAIL_USER']

  # Configure the class responsible to send e-mails.
  config.mailer = 'DeviseMailer'

  # ==> ORM configuration
  require 'devise/orm/active_record'

  # ==> Configuration for any authentication mechanism
  config.authentication_keys = [ :login ]

  # Configure which authentication keys should be case-insensitive.
  config.case_insensitive_keys = [ :email ]

  # Configure which authentication keys should have whitespace stripped.
  config.strip_whitespace_keys = [ :email ]

  # If 401 status code should be returned for AJAX requests. True by default.
  config.http_authenticatable_on_xhr = false

  # By default Devise will store the user in session. You can skip storage for
  # particular strategies by setting this option.
  config.skip_session_storage = [ :http_auth ]

  # ==> Configuration for :database_authenticatable
  config.stretches = Rails.env.test? ? 1 : 10

  # ==> Configuration for :confirmable
  config.allow_unconfirmed_access_for = 0.days

  # A period that the user is allowed to confirm their account before their
  # token becomes invalid.
  # config.confirm_within = 3.days

  # If true, requires any email changes to be confirmed to be applied.
  config.reconfirmable = true

  # Defines which key will be used when confirming an account
  # config.confirmation_keys = [ :email ]

  # ==> Configuration for :rememberable
  # The time the user will be remembered without asking for credentials again.
  config.remember_for = 2.weeks

  # Invalidates all the remember me tokens when the user signs out.
  config.expire_all_remember_me_on_sign_out = true

  # If true, extends the user's remember period when remembered via cookie.
  # config.extend_remember_period = false

  # ==> Configuration for :validatable
  # Range for password length.
  config.password_length = CONFIG.user_password_min_length..CONFIG.user_password_max_length

  # Email regex used to validate email formats. It simply asserts that
  # one (and only one) @ exists in the given string. This is mainly
  # to give user feedback and not to assert the e-mail validity.
  config.email_regexp = /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/

  # ==> Configuration for :recoverable
  config.reset_password_within = 6.hours

  # ==> Navigation configuration
  # The default HTTP method used to sign out a resource. Default is :delete.
  config.sign_out_via = :delete

  # ==> OmniAuth
  # Add a new OmniAuth provider. Check the wiki for more information on setting
  # up on your models and hooks.
  # config.omniauth :github, 'APP_ID', 'APP_SECRET', scope: 'user,public_repo'

  # ==> Configuration for :lockable
  # Defines which strategy will be used to lock an account.
  config.lock_strategy = :failed_attempts

  # Defines which key will be used when locking and unlocking an account
  config.unlock_keys = [ :email ]

  # Defines which strategy will be used to unlock an account.
  # :time  = Re-enables login after a certain amount of time (see :unlock_in below)
  config.unlock_strategy = :email

  # Number of authentication tries before locking an account if lock_strategy
  # is failed attempts.
  config.maximum_attempts = 5

  # Time interval to unlock the account if :time is enabled as unlock_strategy.
  config.unlock_in = 3.hours
end
