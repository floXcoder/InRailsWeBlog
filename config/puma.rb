# frozen_string_literal: true

# Puma can serve each request in a thread from an internal thread pool.
# The `threads` method setting takes two numbers: a minimum and maximum.
# Any libraries that use thread pools should be configured to match
# the maximum value specified for Puma. Default is set to 5 threads for minimum
# and maximum; this matches the default thread size of Active Record.
#
# !!! In production, they are defined in /etc/systemd/system/ginkonote-puma.service
nb_workers = Integer(ENV.fetch('PUMA_WORKERS', 4))
nb_threads = Integer(ENV.fetch('PUMA_THREADS', 3))

current_environment = ENV.fetch('RAILS_ENV', 'development')

# Specifies the `port` that Puma will listen on to receive requests; default is 3000.
#
port Integer(ENV.fetch('PUMA_PORT', 3000))

# Specifies the `environment` that Puma will run in.
#
environment current_environment

# Specifies the `directory` that Puma will use to evaluate path on phased restart.
#
directory ENV.fetch('RAILS_DIRECTORY') { File.expand_path('..', __dir__) }

# Specifies the `pidfile` that Puma will use.
#
pidfile ENV.fetch('PIDFILE', 'tmp/pids/puma.pid')

# # Used by `pumactl` to query and control the server.
# #
# state_path ENV.fetch('STATE_FILE') { 'tmp/pids/puma.state' }

# Specifies the number of `workers` to boot in clustered mode.
# Workers are forked webserver processes. If using threads and workers together
# the concurrency of the application would be max `threads` * `workers`.
# Workers do not work on JRuby or Windows (both of which do not support
# processes).
#
workers nb_workers
threads nb_threads, nb_threads

# Use the `preload_app!` method when specifying a `workers` number.
# This directive tells Puma to first boot the application and load code
# before forking the application. This takes advantage of Copy On Write
# process behavior so workers use less memory. If you use this option
# you need to make sure to reconnect any threads in the `on_worker_boot`
# block.

if current_environment == 'development'
  # Disable for phased restart
  preload_app!
else
  # Required for phased restart
  prune_bundler
end

# If you are preloading your application and using Active Record, it's
# recommended that you close any connections to the database before workers
# are forked to prevent connection leakage.
#
# before_fork do
#   ActiveRecord::Base.connection_pool.disconnect! if defined?(ActiveRecord)
# end

# The code in the `on_worker_boot` will be called if you are using
# clustered mode by specifying a number of `workers`. After each worker
# process is booted, this block will be run. If you are using the `preload_app!`
# option, you will want to use this block to reconnect to any threads
# or connections that may have been created at application boot, as Ruby
# cannot share connections between processes.

# Allow puma to be restarted by `rails restart` command.
plugin :tmp_restart
