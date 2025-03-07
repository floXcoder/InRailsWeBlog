# frozen_string_literal: true

# Add timeout for ElasticSearch
Searchkick.timeout        = 20
Searchkick.search_timeout = 20

Searchkick.index_prefix = ENV['WEBSITE_NAME'].tableize
