# frozen_string_literal: true

# Json adapter for serializers
ActiveModel::Serializer.config.adapter = :json
ActiveModel::Serializer.config.key_transform = :camel_lower
ActiveModel::Serializer.config.default_includes = '**'

ActiveSupport::Notifications.unsubscribe(ActiveModelSerializers::Logging::RENDER_EVENT)
