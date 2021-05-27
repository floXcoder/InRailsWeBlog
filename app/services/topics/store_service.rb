# frozen_string_literal: true

module Topics
  class StoreService < BaseService
    def initialize(topic, *args)
      super(*args)

      @topic = topic
    end

    def perform
      current_language = new_language = current_user&.locale || I18n.locale

      # Sanitization
      unless @params[:name].nil?
        sanitized_name = Sanitize.fragment(@params.delete(:name))
        @topic.slug    = nil if sanitized_name != @topic.name
        @topic.name    = sanitized_name
      end

      if !@params[:description_translations].nil?
        @params.delete(:description_translations).each do |locale, description|
          @topic.description_translations[locale] = ::Sanitizer.new.sanitize_html(description)
        end
      elsif !@params[:description].nil?
        @topic.description = ::Sanitizer.new.sanitize_html(@params.delete(:description))
      end
      @params.delete(:description)
      @params.delete(:description_translations)

      # Languages
      if @params[:languages].present?
        @topic.languages = @params.delete(:languages)
      else
        new_language     = current_user&.locale || I18n.locale.to_s
        @topic.languages = @topic.description_translations.select { |_, value| value.present? }.keys.presence || [current_user&.locale] || [I18n.locale.to_s]
      end
      @topic.languages.uniq!

      @topic.build_icon(image: @params.delete(:icon)) unless @params[:icon].nil?

      @topic.assign_attributes(@params)

      # Adapt topic settings according to mode
      # @topic.article_display = 'grid' if @topic.inventories?

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
