# frozen_string_literal: true

require 'searchkick'
require 'elasticsearch'
require 'typhoeus'

# Add timeout for ElasticSearch
Searchkick.timeout        = 20
Searchkick.search_timeout = 20

Searchkick.index_prefix = ENV['WEBSITE_NAME'].tableize
