# frozen_string_literal: true

module FastJsonapi
  module ObjectSerializer
    def manage_relationships(flat_data, relationships, included)
      relationships&.map do |relation_name, relation_data|
        if relation_data[:data].is_a?(Array)
          flat_data[relation_name] = relation_data[:data]&.map { |d| included&.find { |i| i[:id].to_s == d[:id].to_s && i[:type].to_s == d[:type].to_s }&.dig(:attributes) }
        else
          flat_data[relation_name] = included&.find { |i| i[:id].to_s == relation_data[:data][:id].to_s && i[:type].to_s == relation_data[:data][:type].to_s }&.dig(:attributes)
        end
      end
    end

    def flat_serializable_hash
      data = self.serializable_hash

      if data[:data].is_a?(Array)
        flat_data = data[:data].map do |d|
          new_data = d[:attributes]
          self.manage_relationships(new_data, d[:relationships], data[:included])
          new_data
        end
      else
        flat_data = data.dig(:data, :attributes) || {}
        self.manage_relationships(flat_data, data.dig(:data, :relationships), data.dig(:included))
      end

      return flat_data
    end
  end
end
