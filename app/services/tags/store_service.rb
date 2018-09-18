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
        success(@tag, message)
      else
        message = new_record ? I18n.t('views.tag.flash.error_creation') : I18n.t('views.tag.flash.error_edition')
        error(message, @tag.errors)
      end
    ensure
      I18n.locale = current_language.to_sym if new_language != current_language.to_s
    end

    private

    def sanitize_html(html, lazy_image = true)
      return unless html
      return '' if html.blank?

      # Remove empty beginning block
      html = html.sub(/^<p><br><\/p>/, '')

      html = sanitize(html, tags: %w[h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img], attributes: %w[style class href name target src alt center align data-tag-relation-id])

      html = html.gsub(/(<code>){2,}/i, '<code>')
      html = html.gsub(/(<\/code>){2,}/i, '</code>')

      # Replace pre by pre > code
      html = html.gsub(/<pre( ?)(.*?)>/i, '<pre\1\2><code>')
      html = html.gsub(/<\/pre>/i, '</code></pre>')

      # Replace src by data-src for lazy-loading
      html = html.gsub(/<img (.*?) ?src=/i, '<img \1 data-src=') if lazy_image

      # Improve link security
      html = html.gsub(/<a /i, '<a rel="noopener noreferrer" target="_blank" ')

      return html
    end

  end
end
