# frozen_string_literal: true

module Searches
  class MetaService < Searches::BaseSearchService
    def initialize(query, *args)
      super(query, *args)
    end

    def perform
      meta_results = {
        users:    [],
        tags:     [],
        topics:   [],
        articles: []
      }

      results = Searchkick.search(@query,
                                  models:         [Topic, Tag, Article, User],
                                  model_includes: {
                                    Topic   => [:user],
                                    Tag     => [],
                                    Article => [:user, :tags, :tagged_articles],
                                    User    => []
                                  },
                                  match:          :word_middle,
                                  misspellings:   { below: 2 },
                                  limit:          @params[:limit]&.to_i || 10
      )

      results.each do |result|
        case result.model_name.human
        when 'User'
          meta_results[:users].push(User.as_flat_json(result, strict: true, with_link: true))
        when 'Tag'
          meta_results[:tags].push(Tag.as_flat_json(result, strict: true, with_link: true))
        when 'Topic'
          meta_results[:topics].push(Topic.as_flat_json(result, strict: true, with_link: true))
        when 'Article'
          meta_results[:articles].push(Article.as_flat_json(result, strict: true, with_link: true))
        end
      end

      return success(meta_results)
    end
  end
end
