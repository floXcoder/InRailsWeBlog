# frozen_string_literal: true

# Declare this method in the model:
# data_serializer :serialized_data
module DataSerializerConcern
  extend ActiveSupport::Concern

  included do
    class_attribute :serialize_method
  end

  def serialized_json(format = nil, flat: false, **options)
    self.class.serialized_json(self, format, flat: flat, **options)
  end

  def flat_serialized_json(format = nil, with_model: true, **options)
    serialized_data, serialized_options = self.class.serialized_json(self, format, flat: true, with_model: with_model, **options)

    if with_model
      class_name                   = self.class.name.downcase
      serialized_model             = {}
      serialized_model[class_name] = serialized_data
      serialized_model.merge!(serialized_options) if serialized_options

      return serialized_model
    else
      return serialized_data
    end
  end

  # Class methods
  class_methods do
    def data_serializer(base = nil, _options = {}, &_block)
      self.serialize_method = base
    end

    def serialized_json(data, format = nil, flat: false, with_model: false, **options)
      raise "#{self.serialize_method} must be declared to serialize data" unless self.respond_to?(self.serialize_method)

      if data.is_a?(ActiveRecord::Relation)
        class_name = self.name.downcase.pluralize
        options    = (options || {}).deep_merge(meta: { root: options&.dig(:meta, :root).presence || class_name })
      end

      serialized_data = self.send(self.serialize_method, data, format, **options)

      if flat
        serialized_data.flat_serializable_hash(extract_options: with_model)
      else
        serialized_data.serializable_hash
      end
    end

    def flat_serialized_json(data, format = nil, with_model: true, **options)
      if with_model
        serialized_data, serialized_options = self.serialized_json(data, format, flat: true, with_model: true, **options)

        class_name                   = self.name.downcase.pluralize
        serialized_model             = {}
        serialized_model[class_name] = serialized_data
        serialized_model.merge!(serialized_options) if serialized_options

        return serialized_model
      else
        serialized_data = self.serialized_json(data, format, flat: true, **options)

        return serialized_data
      end
    end
  end
end
