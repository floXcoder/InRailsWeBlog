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

      where_options = options.compact.select { |_k, v| v.present? }.map do |key, value|
        # By default all number inventory fields are range type
        inventory_field = if @params[:current_topic]
                            @params[:current_topic].inventory_fields.find { |inv| inv.field_name == key }
                          end

        if inventory_field && %w[number_type integer_type float_type date_type].include?(inventory_field.value_type)
          min, max = value.is_a?(Array) ? value : value.split(',')
          [
            key,
            {
              gte: min.present? ? min.to_i : nil,
              lte: max.present? ? max.to_i : nil
            }
          ]
        else
          case key
          when :notation
            [
              key,
              value.to_i
            ]
          else
            [key, value]
          end
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

    def format_search(results, highlight_results = nil)
      serializer_parameters                     = {}
      serializer_parameters[:highlight_results] = highlight_results if highlight_results
      serializer_parameters[:current_user]      = @current_user if @current_user

      result_data                                                   = {}
      result_data[@params[:model].name.underscore.pluralize.to_sym] = @params[:model].flat_serialized_json(results, @params[:format], params: serializer_parameters, with_model: false, meta: { root: @params[:model].model_name.plural })
      result_data
    end

    def parsed_search(results)
      formatted_aggregations = []

      results.try(:aggs)&.each do |key, value|
        next if value['buckets'].blank?

        if @params[:current_topic]
          @params[:current_topic].inventory_fields.map do |inventory_field|
            next unless inventory_field.field_name == key

            formatted_aggregations << {
              fieldName: key,
              name:      inventory_field.name,
              valueType: inventory_field.value_type,
              aggs:      value['buckets'].map { |data| [data['key'], data['doc_count']] }.to_h
            }
          end
        else
          formatted_aggregations << {
            fieldName: key,
            aggs:      value['buckets'].map { |data| [data['key'], data['doc_count']] }.to_h
          }
        end
      end

      # Format results into JSON
      highlight_results = {}
      results.with_highlights.each do |item, highlights|
        highlight_results[item.id]           = {}
        highlight_results[item.id][:title]   = highlights[:'title.analyzed'].presence || highlights[:'title']
        highlight_results[item.id][:content] = highlights[:'content.analyzed'].presence || highlights[:'content']
      end
      formatted_results = format_search(results, highlight_results)

      {
        suggestions:  results.suggestions,
        aggregations: formatted_aggregations,
        totalCount:   results.try(:total_count),
        totalPages:   results.try(:total_pages)
      }.merge(formatted_results)
    end

    def track_results(results)
      # Track search results
      @params[:model].track_searches(results.hits.map { |h| h['_id'] })
    end
  end
end
