# frozen_string_literal: true

module Tags
  class StoreService < BaseService
    def initialize(tag, *args)
      super(*args)

      @tag = tag
    end

    def perform
      current_language = new_language = current_user&.locale || I18n.locale

      # Sanitization
      unless @params[:name].nil?
        sanitized_name = Sanitize.fragment(@params.delete(:name))
        @tag.slug      = nil if sanitized_name != @tag.name
        @tag.name      = sanitized_name
      end

      if !@params[:description_translations].nil?
        @params.delete(:description_translations).each do |locale, description|
          @tag.description_translations[locale] = ::Sanitizer.new.sanitize_html(description)
        end
      elsif !@params[:description].nil?
        @tag.description = ::Sanitizer.new.sanitize_html(@params[:description])
      end
      @params.delete(:description)
      @params.delete(:description_translations)

      @tag.build_icon(image: @params.delete(:icon)) unless @params[:icon].nil?

      @tag.languages = if @params[:languages].present?
                         @params.delete(:languages)
                       else
                         @tag.description_translations.select { |_, value| value.present? }.keys.presence || [current_user&.locale] || [I18n.locale.to_s]
                       end

      @tag.assign_attributes(@params)

      new_record = @tag.new_record?
      if @tag.save
        message = new_record ? I18n.t('views.tag.flash.successful_creation') : I18n.t('views.tag.flash.successful_edition')
        success(@tag.reload, message)
      else
        message = new_record ? I18n.t('views.tag.flash.error_creation') : I18n.t('views.tag.flash.error_edition')
        error(message, @tag.errors)
      end
    ensure
      I18n.locale = current_language.to_sym if new_language != current_language.to_s
    end

  end
end
