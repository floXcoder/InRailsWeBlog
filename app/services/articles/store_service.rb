# frozen_string_literal: true

module Articles
  class StoreService < BaseService
    include CacheService

    def initialize(article, *args)
      super(*args)

      @article = article
    end

    def perform
      current_language = new_language = @current_user.locale || I18n.locale

      auto_save                  = @params.delete(:auto_save)
      was_auto_saved             = @params.delete(:was_auto_saved)

      PaperTrail.request.enabled = false if auto_save || @article.draft? || @params[:draft]

      new_article = @article.new_record?

      previous_slugs = new_article ? nil : @article.slug_translations

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
      if @params[:title_translations].nil? && @article.new_record?
        @article.languages = [I18n.locale]
      elsif @params[:title_translations].present?
        @article.languages = @params[:title_translations].compact_blank.keys
      end

      I18n.locale             = new_language.to_sym if new_language != current_language.to_s

      # Sanitization
      if !@params[:title_translations].nil?
        # Clear other translations
        @article.title_translations = {} unless new_article

        @params.delete(:title_translations).each do |locale, title|
          @article.title_translations[locale] = Sanitize.fragment(title)
        end
      elsif !@params[:title].nil?
        sanitized_title = Sanitize.fragment(@params[:title])
        @article.title  = sanitized_title
      end
      @params.delete(:title)
      @params.delete(:title_translations)

      # Add slug for all languages
      slug_translations = {}
      I18n.available_locales.each do |locale|
        I18n.with_locale(locale) do
          slug_translations.merge!(@article.set_friendly_id)
        end
      end
      @article.slug_translations = slug_translations

      if !@params[:summary_translations].nil?
        # Clear other translations
        @article.summary_translations = {} unless new_article

        @params.delete(:summary_translations).each do |locale, summary|
          @article.summary_translations[locale.to_s] = Sanitize.fragment(summary)
        end
      elsif !@params[:summary].nil?
        @article.summary = Sanitize.fragment(@params.delete(:summary))
      else
        @params.delete(:summary)
      end

      if !@params[:content_translations].nil?
        # Clear other translations
        @article.content_translations = {} unless new_article

        @params.delete(:content_translations).each do |locale, content|
          @article.content_translations[locale.to_s] = ::Sanitizer.new.sanitize_html(content)
        end

        @article.child_relationships = extract_relationships(@article.content)
      elsif !@params[:content].nil?
        @article.content = ::Sanitizer.new.sanitize_html(@params[:content])

        @article.child_relationships = extract_relationships(@article.content)
      end
      @params.delete(:content)
      @params.delete(:content_translations)

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
            @article.pictures << picture if picture
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
          tags = [@params.delete(:parent_tags), @params.delete(:child_tags), @params.delete(:tags)].compact.flatten.uniq
          Tag.parse_tags(tags, owner_id).map do |tag|
            tagged_article_attributes << {
              tag:      tag,
              user_id:  @article.user_id,
              topic_id: @article.topic_id
            }
          end
        end

        @article.tagged_articles = tagged_article_attributes.map do |tagged_article_attribute|
          if @article.id
            @article.tagged_articles.find_by(tagged_article_attribute) || @article.tagged_articles.build(tagged_article_attribute)
          else
            @article.tagged_articles.build(tagged_article_attribute)
          end
        end

        @article.tag_relationships = tag_relationships_attributes.map do |tag_relationships_attribute|
          @article.tag_relationships.find_by(tag_relationships_attribute) || @article.tag_relationships.build(tag_relationships_attribute)
        end

        @params.delete(:parent_tags)
        @params.delete(:child_tags)
        @params.delete(:tags)
      end

      @article.rank        = @params.delete(:rank).to_i if @params[:rank].present?
      @article.home_page   = @params.delete(:home_page) if @params[:home_page].present?

      @article.assign_attributes(@params)

      article_changed = @article.changes.present?

      if @article.save
        message = new_article ? I18n.t('views.article.flash.successful_creation', title: @article.title) : I18n.t('views.article.flash.successful_edition', title: @article.title)

        # Force saving new version in case of auto-saving
        @article.paper_trail.save_with_version if was_auto_saved && !article_changed

        # Remove deleted pictures
        old_picture_ids     = @article.picture_ids
        new_picture_ids     = @article.content_translations&.values&.map { |c| c.scan(/\/uploads\/article\/pictures\/(\d+)/) }&.flatten&.map(&:to_i) || []
        remove_picture_ids  = old_picture_ids - new_picture_ids
        if remove_picture_ids.present?
          @article.pictures.delete(Picture.where(id: remove_picture_ids))
        end
        missing_picture_ids = old_picture_ids - new_picture_ids
        if missing_picture_ids.present?
          missing_picture_ids.each do |picture_id|
            picture = Picture.find_by(id: picture_id.to_i)
            @article.pictures << picture if picture
          end
        end
        # Ensure each picture is associated to current article
        @article.pictures.each do |picture|
          picture.imageable = @article
          picture.save(validate: false)
        end

        # Add automatic redirection for renamed public articles
        check_redirection(previous_slugs)

        # Remove cache
        expire_component_cache("user_tags:#{@article.user_id}_for_#{@article.topic_id}")
        expire_component_cache("user_tags:#{@article.user_id}")

        success(@article.reload, message)
      else
        message = new_article ? I18n.t('views.article.flash.error_creation') : I18n.t('views.article.flash.error_edition')
        error(message, @article.errors)
      end
    rescue StandardError => error
      error(error.message, error)
    ensure
      # Ensure paper trail is active again in case of autosave
      PaperTrail.request.enabled = true

      I18n.locale                = current_language.to_sym if new_language != current_language.to_s
    end

    private

    def extract_relationships(content)
      # Extract all relationship ids
      extracted_article_ids = []
      article_relationships = []
      return article_relationships if content.blank?

      content.scan(/data-article-relation-id="(\d+)"/) { |article_id| extracted_article_ids << article_id }

      extracted_article_ids.flatten.uniq.map do |article_id|
        article_relationships << @article.child_relationships.find_or_initialize_by(user: @article.user, child: @article, parent_id: article_id) if Article.find_by(id: article_id)
      end

      return article_relationships.uniq
    end

    def check_redirection(previous_slugs)
      return unless previous_slugs
      return unless @article.everyone?

      if @article.multi_languages?
        @article.languages.each do |language|
          @article.redirections.create(previous_slug: previous_slugs[language.to_s], current_slug: @article.slug_translations[language.to_s], locale: language.to_s)
        end
      else
        @article.redirections.create(previous_slug: previous_slugs[I18n.locale.to_s], current_slug: @article.slug)
      end
    end

  end
end
