# frozen_string_literal: true

module Topics
  class StoreService < BaseService
    def initialize(topic, *args)
      super(*args)

      @topic = topic
    end

    def perform
      current_language = new_language = current_user&.locale || I18n.locale

      # Language
      if @topic.languages.empty? || @params[:language].present?
        new_language = (@params.delete(:language) || current_user&.locale || I18n.locale).to_s
        @topic.languages |= [new_language]
        I18n.locale = new_language.to_sym if new_language != current_language.to_s
      end

      # Sanitization
      unless @params[:name].nil?
        sanitized_name = Sanitize.fragment(@params.delete(:name))
        @topic.slug      = nil if sanitized_name != @topic.name
        @topic.name      = sanitized_name
      end

      unless @params[:description].nil?
        @topic.description = Sanitize.fragment(@params.delete(:description))
      end

      unless @params[:icon].nil?
        @topic.build_icon(image: @params.delete(:icon))
      end

      @topic.assign_attributes(@params)

      new_record = @topic.new_record?
      if @topic.save
        message = new_record ? I18n.t('views.topic.flash.successful_creation') : I18n.t('views.topic.flash.successful_edition')
        success(@topic.reload, message)
      else
        message = new_record ? I18n.t('views.topic.flash.error_creation') : I18n.t('views.topic.flash.error_edition')
        error(message, @topic.errors)
      end
    ensure
      I18n.locale = current_language.to_sym if new_language != current_language.to_s
    end

  end
end
