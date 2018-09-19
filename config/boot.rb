# frozen_string_literal: true

ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

require 'bundler/setup' # Set up gems listed in the Gemfile.

if ENV['RAILS_ENV'] != 'production' && ENV['RAILS_ENV'] != 'beta'
  # Listen >=2.8 patch to silence duplicate directory errors.
  require 'listen/record/symlink_detector'
  module Listen
    class Record
      class SymlinkDetector
        def _fail(_, _)
          fail Error, "Don't watch locally-symlinked directory twice"
        end
      end
    end
  end

  require 'bootsnap' # Speed up boot time by caching expensive operations.

  Bootsnap.setup(
    cache_dir: 'tmp/cache', # Path to your cache
    load_path_cache: true, # Should we optimize the LOAD_PATH with a cache?
    autoload_paths_cache: true, # Should we optimize ActiveSupport autoloads with cache?
    compile_cache_iseq: true, # Should compile Ruby code into ISeq cache?
    compile_cache_yaml: false # Skip YAML cache for now, cause we were seeing issues with it
  )
end
