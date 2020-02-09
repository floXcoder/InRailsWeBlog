# frozen_string_literal: true

module Articles
  class StoreService < BaseService
    def initialize(article, *args)
      super(*args)

      @article = article
    end

    def perform
      current_language = new_language = @current_user.locale || I18n.locale

      new_article = @article.new_record?

      # Use topic owner in case of shared topics
      shared_topic            = @article.user_id != @current_user.id || @current_user.current_topic.user_id != @current_user.id
      owner_id                = shared_topic ? @current_user.current_topic.user_id : @current_user.id
      @article.user_id        = owner_id unless @article.user_id

      @article.contributor_id = @current_user.id if shared_topic

      # Topic: Set current topic to article (only for new articles)
      if new_article
        @article.topic_id = @params[:topic_id].present? ? @params.delete(:topic_id) : @current_user.current_topic_id
      else
        @params.delete(:topic_id)
      end

      if @article.topic&.stories?
        @article.mode = :story
      elsif @article.topic&.inventories?
        @article.mode = :inventory
      end

      # Languages
      if !@params[:title_translations].nil?
        @article.languages = @params[:title_translations].select { |_, value| value.present? }.keys
      else
        @article.languages = [I18n.locale]
      end

      I18n.locale = new_language.to_sym if new_language != current_language.to_s

      # Sanitization
      if !@params[:title_translations].nil?
        @params.delete(:title_translations).each do |locale, title|
          @article.title_translations[locale] = Sanitize.fragment(title)
          @article.slug                       = nil if I18n.locale.to_s == locale.to_s && Sanitize.fragment(title) != @article.title
        end
      elsif !@params[:title].nil?
        sanitized_title = Sanitize.fragment(@params[:title])
        @article.slug   = nil if sanitized_title != @article.title
        @article.title  = sanitized_title
      end
      @params.delete(:title)

      if !@params[:summary_translations].nil?
        @params.delete(:summary_translations).each do |locale, summary|
          @article.summary_translations[locale] = Sanitize.fragment(summary)
        end
      elsif !@params[:summary].nil?
        @article.summary = Sanitize.fragment(@params.delete(:summary))
      else
        @params.delete(:summary)
      end

      if !@params[:content_translations].nil?
        @params.delete(:content_translations).each do |locale, content|
          @article.content_translations[locale] = ::Sanitizer.new.sanitize_html(content)
        end

        @article.child_relationships = extract_relationships(@article.content)
      elsif !@params[:content].nil?
        @article.content = ::Sanitizer.new.sanitize_html(@params[:content])

        @article.child_relationships = extract_relationships(@article.content)
      end
      @params.delete(:content)

      unless @params[:reference].nil?
        reference_url      = ActionController::Base.helpers.sanitize(@params.delete(:reference))
        reference_url      = "http://#{reference_url}" if reference_url.present? && reference_url !~ /^https?:\/\//
        @article.reference = reference_url
      end

      @article.inventories = @params.delete(:inventories) unless @params[:inventories].nil?

      # Pictures
      if @params[:picture_ids].present?
        @params.delete(:picture_ids).split(',').each do |picture_id|
          if picture_id.present?
            picture = Picture.find_by(id: picture_id.to_i)
            @article.pictures << picture
          end
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

          parent_tags = Tag.parse_tags(@params.delete(:parent_tags), owner_id)
          parent_tags.map do |tag|
            tagged_article_attributes << {
              tag:      tag,
              user_id:  @article.user_id,
              topic_id: @article.topic_id,
              parent:   true
            }
          end

          child_tags = Tag.parse_tags(@params.delete(:child_tags), owner_id)
          child_tags.map do |tag|
            tagged_article_attributes << {
              tag:      tag,
              user_id:  @article.user_id,
              topic_id: @article.topic_id,
              child:    true
            }
          end

          tag_relationships_attributes = parent_tags.map do |parent_tag|
            child_tags.map do |child_tag|
              {
                parent:   parent_tag,
                child:    child_tag,
                user_id:  @article.user_id,
                topic_id: @article.topic_id
              }
            end
          end.flatten
        else
          tags = [@params.delete(:parent_tags), @params.delete(:child_tags), @params.delete(:tags)].compact.flatten
          Tag.parse_tags(tags, owner_id).map do |tag|
            tagged_article_attributes << {
              tag:      tag,
              user_id:  @article.user_id,
              topic_id: @article.topic_id
            }
          end
        end

        @article.tagged_articles = [] if tagged_article_attributes.present?
        tagged_article_attributes&.each do |tagged_article_attribute|
          if @article.id
            if tagged_article_attribute[:tag].id && (tagged_article = @article.tagged_articles.find { |ta| ta.tag_id == tagged_article_attribute[:tag].id })
              tagged_article.assign_attributes(tagged_article_attribute)
            else
              @article.tagged_articles.build(tagged_article_attribute)
            end
          else
            @article.tagged_articles.build(tagged_article_attribute)
          end
        end

        @article.tag_relationships = [] if tag_relationships_attributes.present?
        tag_relationships_attributes&.each do |tag_relationships_attribute|
          if (tag_relationship = @article.tag_relationships.find { |tr|
            tr.parent == tag_relationships_attributes[:parent] &&
              tr.child == tag_relationships_attributes[:child] &&
              tr.user_id == tag_relationships_attributes[:user_id] &&
              tr.topic_id == tag_relationships_attributes[:topic_id] })
            tag_relationship.assign_attributes(tag_relationships_attribute)
          else
            @article.tag_relationships.build(tag_relationships_attribute)
          end
        end

        @params.delete(:parent_tags)
        @params.delete(:child_tags)
        @params.delete(:tags)
      end

      @article.assign_attributes(@params)

      if @article.save
        message = new_article ? I18n.t('views.article.flash.successful_creation', title: @article.title) : I18n.t('views.article.flash.successful_edition', title: @article.title)
        @article.pictures.each do |picture|
          picture.imageable = @article
          picture.save(validate: false)
        end
        success(@article.reload, message)
      else
        message = new_article ? I18n.t('views.article.flash.error_creation') : I18n.t('views.article.flash.error_edition')
        error(message, @article.errors)
      end
    ensure
      I18n.locale = current_language.to_sym if new_language != current_language.to_s
    end

    private

    def extract_relationships(content)
      # Extract all relationship ids
      other_ids             = []
      article_relationships = []
      content.scan(/data-article-relation-id="(\d+)"/) { |other_id| other_ids << other_id }

      other_ids.flatten.map do |other_id|
        article_relationships << @article.child_relationships.find_or_initialize_by(user: @article.user, child: @article, parent_id: other_id)
      end

      return article_relationships
    end

  end
end
