# frozen_string_literal: true

module Tags
  class StoreService < BaseService
    def initialize(tag, *args)
      super(*args)

      @tag = tag
    end

    def perform
      current_language = new_language = current_user&.locale || I18n.locale

      #  Language
      if @tag.languages.empty? || @params[:language].present?
        new_language   = (@params.delete(:language) || current_user&.locale || I18n.locale).to_s
        @tag.languages |= [new_language]
        I18n.locale    = new_language.to_sym if new_language != current_language.to_s
      end

      # Sanitization
      unless @params[:name].nil?
        sanitized_name = Sanitize.fragment(@params.delete(:name))
        @tag.slug      = nil if sanitized_name != @tag.name
        @tag.name      = sanitized_name
      end

      unless @params[:description].nil?
        @tag.description = Sanitize.fragment(@params.delete(:description))
      end

      unless @params[:icon].nil?
        @tag.build_icon(image: @params.delete(:icon))
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
