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
          meta_results[:users].push(User.serialized_json(result, 'strict', flat: true, with_model: false, params: { with_link: true }))
        when 'Tag'
          meta_results[:tags].push(Tag.serialized_json(result, 'strict', flat: true, with_model: false, params: { with_link: true }))
        when 'Topic'
          meta_results[:topics].push(Topic.serialized_json(result, 'strict', flat: true, with_model: false, params: { with_link: true }))
        when 'Article'
          meta_results[:articles].push(Article.serialized_json(result, 'strict', flat: true, with_model: false, params: { with_link: true }).serializable_hash[:data])
        end
      end

      return success(meta_results)
    end
  end
end
