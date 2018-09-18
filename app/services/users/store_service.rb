# frozen_string_literal: true

module Users
  class StoreService < BaseService
    def initialize(user, *args)
      super(*args)

      @user = user
    end

    def perform
      # Sanitization
      unless @params[:first_name].nil?
        @params[:first_name] = Sanitize.fragment(@params.delete(:first_name))
      end
      unless @params[:last_name].nil?
        @params[:last_name] = Sanitize.fragment(@params.delete(:last_name))
      end
      unless @params[:city].nil?
        @params[:city] = Sanitize.fragment(@params.delete(:city))
      end
      unless @params[:additional_info].nil?
        @params[:additional_info] = Sanitize.fragment(@params.delete(:additional_info))
      end

      # User picture: take uploaded picture otherwise remote url
      if @params[:picture_attributes] &&
        @params[:picture_attributes][:image] &&
        @params[:picture_attributes][:remote_image_url] &&
        !@params[:picture_attributes][:remote_image_url].blank?
        @params[:picture_attributes].delete(:remote_image_url)
      end

      if @params[:picture_attributes] &&
        !@params[:picture_attributes][:user_id]
        @params[:picture_attributes][:user_id] = self.id
      end

      # User picture: take uploaded picture otherwise remote url
      if params[:picture_attributes] &&
        params[:picture_attributes][:image] &&
        params[:picture_attributes][:remote_image_url] &&
        params[:picture_attributes][:remote_image_url].present?
        @params[:picture_attributes].delete(:remote_image_url)
      end

      # Current use can not remove his own admin rights
      @params.delete(:admin) if current_user&.admin? && current_user.id == user.id

      if @user.update_without_password(@params)
        message = I18n.t('views.user.flash.successful_edition')
        success(@user, message)
      else
        message = I18n.t('views.user.flash.error_edition')
        error(message, @user.errors)
      end
    end

    private

    def sanitize_html(html, lazy_image = true)
      return unless html
      return '' if html.blank?

      # Remove empty beginning block
      html = html.sub(/^<p><br><\/p>/, '')

      html = sanitize(html, tags: %w[h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img], attributes: %w[style class href name target src alt center align data-user-relation-id])

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
