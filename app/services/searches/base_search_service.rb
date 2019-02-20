# frozen_string_literal: true

module Searches
  class BaseSearchService < BaseService
    attr_accessor :query

    def initialize(query, *args)
      super(*args)

      @query = query
    end

    def search_type(type, current_type, options = {})
      (return options[:strict] ? false : true) unless current_type

      if current_type.is_a?(Array)
        return current_type.map(&:downcase).include?(type.to_s.downcase)
      else
        if type.to_s.casecmp(current_type.to_s).zero?
          return true
        else
          return !%w[article tag topic].include?(current_type.to_s.downcase)
        end
      end
    end

    def where_search(options)
      options ||= {}

      where_options           = options.compact.select { |_k, v| v.present? }.map do |key, value|
        case key
        when :notation
          [
            key,
            value.to_i
          ]
        else
          [key, value]
        end
      end.to_h

      return where_options
    end

    def order_search(order)
      case order
      when 'id_asc'
        { id: :asc }
      when 'id_desc'
        { id: :desc }
      when 'priority_asc'
        { priority: :asc }
      when 'priority_desc'
        { priority: :desc }
      when 'created_asc'
        { created_at: :asc }
      when 'created_desc'
        { created_at: :desc }
      when 'updated_asc'
        { updated_at: :asc }
      when 'updated_desc'
        { updated_at: :desc }
      when 'rank_asc'
        { rank: :asc }
      when 'rank_desc'
        { rank: :desc }
      when 'popularity_asc'
        { popularity: :asc }
      when 'popularity_desc'
        { popularity: :desc }
      else
        nil
      end
    end

    def format_search(results)
      serializer_options                = case @params[:format]
                                          when 'strict'
                                            {
                                              root:   @params[:model].model_name.plural,
                                              strict: true
                                            }
                                          when 'complete'
                                            {
                                              complete: true
                                            }
                                          else
                                            {
                                              sample: true
                                            }
                                          end

      serializer_options[:current_user] = @current_user if @current_user

      @params[:model].as_json(results, serializer_options)
    end

    def parsed_search(results)
      formatted_aggregations = {}
      results.aggs&.each do |key, value|
        formatted_aggregations[key] = value['buckets'].map { |data| [data['key'], data['doc_count']] }.to_h if value['buckets'].any?
      end

      # Track search results
      @params[:model].track_searches(results.map(&:id))

      # Format results into JSON
      formatted_results = format_search(results)

      {
        suggestions:  results.suggestions,
        aggregations: formatted_aggregations,
        total_count:  results.total_count,
        total_pages:  results.total_pages
      }.merge(formatted_results)
    end
  end
end
