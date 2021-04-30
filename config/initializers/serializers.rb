# frozen_string_literal: true

# Add method to return a flat object without data or attributes
module FastJsonapi
  module ObjectSerializer
    def manage_relationships(flat_data, relationships, included)
      relationships&.map do |relation_name, relation_data|
        flat_data[relation_name] = if relation_data[:data].is_a?(Array)
                                     relation_data[:data]&.map { |d| included&.find { |i| i[:id].to_s == d[:id].to_s && i[:type].to_s == d[:type].to_s }&.dig(:attributes) }
                                   else
                                     included&.find { |i| i[:id].to_s == relation_data[:data][:id].to_s && i[:type].to_s == relation_data[:data][:type].to_s }&.dig(:attributes)
                                   end
      end
    end

    def flat_serializable_hash(extract_options = false)
      data       = self.serializable_hash
      other_keys = data.except(:data, :included)

      if data[:data].is_a?(Array)
        flat_data = data[:data].map do |d|
          new_data = d[:attributes]
          self.manage_relationships(new_data, d[:relationships], data[:included])
          # new_data.merge!(other_keys) unless extract_options
          new_data
        end
      else
        flat_data = data.dig(:data, :attributes) || {}
        self.manage_relationships(flat_data, data.dig(:data, :relationships), data[:included])
        # flat_data.merge!(other_keys) unless extract_options
      end

      if extract_options
        return flat_data, other_keys
      else
        return flat_data
      end
    end
  end
end
