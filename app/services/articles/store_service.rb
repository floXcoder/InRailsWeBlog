# frozen_string_literal: true

module Articles
  class StoreService < BaseService
    include ActionView::Helpers::SanitizeHelper

    def initialize(article, *args)
      super(*args)

      @article = article
    end

    def perform
      current_language = new_language = @current_user&.locale || I18n.locale

      # Topic: Add current topic to article
      if !@article.topic_id || @params[:topic_id].present?
        @article.topic_id = @params[:topic_id] || @current_user&.current_topic_id
      end

      # Language
      if @article.languages.empty? || @params[:language].present?
        new_language       = (@params.delete(:language) || @current_user&.locale || I18n.locale).to_s
        @article.languages |= [new_language]
      end

      I18n.locale = new_language.to_sym if new_language != current_language.to_s

      # Sanitization
      unless @params[:title].nil?
        sanitized_title = Sanitize.fragment(@params.delete(:title))
        @article.slug   = nil if sanitized_title != @article.title
        @article.title  = sanitized_title
      end

      unless @params[:summary].nil?
        @article.summary = Sanitize.fragment(@params.delete(:summary))
      end

      unless @params[:content].nil?
        @article.content = sanitize_html(@params.delete(:content))

        # Extract all relationship ids
        other_ids             = []
        article_relationships = []
        @article.content.scan(/data-article-relation-id="(\d+)"/) { |other_id| other_ids << other_id }

        other_ids.flatten.map do |other_id|
          article_relationships << @article.child_relationships.find_or_initialize_by(user: @article.user, child: @article, parent_id: other_id)
        end

        @article.child_relationships = article_relationships
      end

      unless @params[:reference].nil?
        reference_url      = ActionController::Base.helpers.sanitize(@params.delete(:reference))
        reference_url      = "http://#{reference_url}" if reference_url.present? && reference_url !~ /^https?:\/\//
        @article.reference = reference_url
      end

      # Pictures
      if @params[:picture_ids].present?
        @params.delete(:picture_ids).split(',').each do |picture_id|
          @article.pictures << Picture.find_by(id: picture_id.to_i) if picture_id.present?
        end
      else
        @params.delete(:picture_ids)
      end

      # Tags
      if !@params[:tags].nil? || !@params[:parent_tags].nil? || !@params[:child_tags].nil?
        tagged_article_attributes    = []
        tag_relationships_attributes = []

        if !@params[:parent_tags].nil? && !@params[:child_tags].nil?
          # Remove duplicated tags in children if any
          @params[:child_tags] = @params[:child_tags].reject do |child|
            @params[:parent_tags].include?(child)
          end

          parent_tags = Tag.parse_tags(@params.delete(:parent_tags), @current_user&.id)
          parent_tags.map do |tag|
            tagged_article_attributes << {
              tag: tag, user_id: @article.user_id, topic_id: @article.topic_id, parent: true
            }
          end

          child_tags = Tag.parse_tags(@params.delete(:child_tags), @current_user&.id)
          child_tags.map do |tag|
            tagged_article_attributes << {
              tag: tag, user_id: @article.user_id, topic_id: @article.topic_id, child: true
            }
          end

          tag_relationships_attributes = parent_tags.map do |parent_tag|
            child_tags.map do |child_tag|
              {
                parent: parent_tag, child: child_tag, user_id: @article.user_id, topic_id: @article.topic_id
              }
            end
          end.flatten
        else
          tags = [@params.delete(:parent_tags), @params.delete(:child_tags), @params.delete(:tags)].compact.flatten
          Tag.parse_tags(tags, @current_user&.id).map do |tag|
            tagged_article_attributes << {
              tag: tag, user_id: @article.user_id, topic_id: @article.topic_id
            }
          end
        end

        new_tagged_articles = tagged_article_attributes.map do |tagged_article_attribute|
          if @article.id
            if (tagged_article = @article.tagged_articles.where(tag_id: tagged_article_attribute[:tag].id).first)
              tagged_article.assign_attributes(tagged_article_attribute)
              tagged_article
            else
              @article.tagged_articles.build(tagged_article_attribute)
            end
          else
            @article.tagged_articles.build(tagged_article_attribute)
          end
        end

        new_tag_relationships = tag_relationships_attributes.map do |tag_relationships_attribute|
          if (tag_relationship = TagRelationship.where(tag_relationships_attribute).first)
            tag_relationship.assign_attributes(tag_relationships_attribute)
            tag_relationship
          else
            @article.tag_relationships.build(tag_relationships_attribute)
          end
        end

        @params.delete(:parent_tags)
        @params.delete(:child_tags)
        @params.delete(:tags)

        @article.tagged_articles   = new_tagged_articles
        @article.tag_relationships = new_tag_relationships
      end

      @article.assign_attributes(@params)

      new_record = @article.new_record?
      if @article.save
        message = new_record ? I18n.t('views.article.flash.successful_creation') : I18n.t('views.article.flash.successful_edition')
        success(@article, message)
      else
        message = new_record ? I18n.t('views.article.flash.error_creation') : I18n.t('views.article.flash.error_edition')
        error(message, @article.errors)
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

      html = sanitize(html, tags: %w[h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img], attributes: %w[style class href name target src alt center align data-article-relation-id])

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
