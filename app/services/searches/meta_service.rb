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
          meta_results[:users].push(UserStrictSerializer.new(result, params: { with_link: true }).serializable_hash[:data])
        when 'Tag'
          meta_results[:tags].push(TagStrictSerializer.new(result, params: { with_link: true }).serializable_hash[:data])
        when 'Topic'
          meta_results[:topics].push(TopicStrictSerializer.new(result, params: { with_link: true }).serializable_hash[:data])
        when 'Article'
          meta_results[:articles].push(ArticleStrictSerializer.new(result, params: { with_link: true }).serializable_hash[:data])
        end
      end

      return success(meta_results)
    end
  end
end
