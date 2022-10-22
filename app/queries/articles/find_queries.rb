# frozen_string_literal: true

module Articles
  class FindQueries < BaseQuery
    attr_reader :relation

    def initialize(current_user = nil, current_admin = nil, relation = Article.all)
      super(current_user, current_admin)

      @relation       = relation.extending(Scopes)
      @user_articles  = nil
      @topic_articles = nil
    end

    def all(params = {})
      user_filter     = { id: params[:user_id], slug: params[:user_slug] }.compact
      topic_filter    = { id: params[:topic_id], slug: params[:topic_slug] }.compact

      @user_articles  = User.find_by(user_filter) if user_filter.present?
      @topic_articles = params[:shared_topic] ? @user_articles.contributed_topics.find_by(topic_filter) : @user_articles.topics.find_by(topic_filter) if @user_articles && topic_filter.present?

      return Article.none if (user_filter.present? && !@user_articles) || (topic_filter.present? && !@topic_articles)

      @relation = @relation
                    .include_collection(with_current_user: !!@current_user)
                    .with_adapted_visibility(@current_user, @current_admin)
                    .order_by(article_order(params)).order_by('updated_desc')
                    .filter_by(params, @current_user, @user_articles, @topic_articles)
                    .filter_by_locale(@current_user)
                    .paginate_or_limit(params, @current_user)

      return @relation
    end

    def available_languages(params = {})
      user_filter     = { id: params[:user_id], slug: params[:user_slug] }.compact
      topic_filter    = { id: params[:topic_id], slug: params[:topic_slug] }.compact

      @user_articles  = User.find_by(user_filter) if user_filter.present?
      @topic_articles = params[:shared_topic] ? @user_articles.contributed_topics.find_by(topic_filter) : @user_articles.topics.find_by(topic_filter) if @user_articles && topic_filter.present?

      return Article.none if (user_filter.present? && !@user_articles) || (topic_filter.present? && !@topic_articles)

      @relation = @relation
                    .include_collection(with_current_user: !!@current_user)
                    .with_adapted_visibility(@current_user, @current_admin)
                    .order_by(article_order(params)).order_by('updated_desc')
                    .filter_by(params, @current_user, @user_articles, @topic_articles)
                    .pluck(:languages).flatten.uniq

      return @relation
    end

    def complete(params = {})
      @relation = @relation
                    .includes(:tags, :tagged_articles, :tracker, :share, :pictures, :user, topic: [:inventory_fields])
                    .order_by(params[:order].presence || 'popularity_desc').order_by('updated_desc')
                    .with_visibility(params[:visibility] || 'everyone')
                    .with_adapted_visibility(@current_user, @current_admin)

      return @relation
    end

    def recommendations(params = {})
      @relation = @relation
                    .include_collection
                    .everyone
                    .with_locale

      if params[:article]
        article = params[:article]

        if article.topic&.stories?
          @relation = @relation
                        .filter_by(params, @current_user, @user_articles, article.topic)
                        .order_by('updated_desc')
                        .to_a

          current_article_index = @relation.index { |a| a.id == article.id }
          @relation             = case current_article_index
                                  when nil, -1
                                    []
                                  when 0
                                    [@relation[1]]
                                  when @relation.length - 1
                                    [@relation[current_article_index - 1]]
                                  else
                                    [
                                      @relation[current_article_index - 1],
                                      @relation[current_article_index + 1]
                                    ]
                                  end
          @relation.compact!
        else
          @relation = @relation
                        .filter_by(params, @current_user, @user_articles, article.topic)
                        .order_by('priority_desc')
                        .paginate_or_limit({ limit: 2 }, @current_user)
        end
      else
        @relation = Article.none
      end

      return @relation.presence || Article.none
    end

    def home(params = {})
      I18n.with_locale(params[:with_locale].presence || I18n.locale) do
        @relation = @relation
                      .include_collection
                      .everyone
                      .home(params[:limit]&.to_i)

        if params[:with_locale]
          @localized_relation = @relation.with_locale(params[:with_locale])
          @relation           = @localized_relation if @localized_relation.exists?
        end
      end

      return @relation
    end

    def populars(params = {})
      @relation = @relation
                    .include_collection
                    .everyone
                    .populars(params[:limit]&.to_i)

      if params[:with_locale]
        @localized_relation = @relation.with_locale(params[:with_locale])
        @relation           = @localized_relation if @localized_relation.exists?
      end

      return @relation
    end

    module Scopes
      def include_collection(with_current_user: false)
        with_current_user ? includes(:tags, :tagged_articles, :pictures, :user, topic: [:user, :inventory_fields, :tagged_articles, :tracker]) : includes(:topic, :tags, :tagged_articles, :pictures, :user)
      end

      def with_adapted_visibility(current_user = nil, current_admin = nil)
        if current_admin
          all
        elsif current_user
          everyone_and_user(current_user.id)
        else
          everyone
        end
      end

      def order_by(order)
        case order
        when 'priority_asc'
          order('articles.priority ASC NULLS LAST')
        when 'priority_desc'
          order('articles.priority DESC NULLS LAST')
        when 'id_asc'
          order('articles.id ASC')
        when 'id_desc'
          order('articles.id DESC')
        when 'created_asc'
          order('articles.created_at ASC')
        when 'created_desc'
          order('articles.created_at DESC')
        when 'updated_asc'
          order('articles.updated_at ASC')
        when 'updated_desc'
          order('articles.updated_at DESC')
        when 'tag_asc'
          order('tags.name ASC NULLS LAST')
        when 'tags_desc'
          order('tags.name DESC NULLS LAST')
        when 'visits_asc'
          joins(:tracker).order('trackers.visits_count ASC NULLS LAST')
        when 'visits_desc'
          joins(:tracker).order('trackers.visits_count DESC NULLS LAST')
        when 'rank_asc'
          joins(:tracker).order('trackers.rank ASC NULLS LAST')
        when 'rank_desc'
          joins(:tracker).order('trackers.rank DESC NULLS LAST')
        when 'popularity_asc'
          joins(:tracker).order('trackers.popularity ASC NULLS LAST')
        when 'popularity_desc'
          joins(:tracker).order('trackers.popularity DESC NULLS LAST')
        else
          all
        end
      end

      def filter_by(filter, current_user = nil, user_articles = nil, topic_articles = nil)
        return self if filter.blank?

        records = self

        records = records.where(id: filter[:article_ids]) if filter[:article_ids]

        records = records.where(accepted: filter[:accepted]) if filter[:accepted]
        records = records.with_visibility(filter[:visibility]) if filter[:visibility]

        if filter[:bookmarked] && current_user
          records = records.bookmarked_by_user(current_user.id)
        elsif topic_articles
          records = records.from_topic_id(topic_articles.id)
        elsif user_articles
          records = records.from_user_id(user_articles.id, current_user&.id)
        end

        records = if filter[:parent_tag_slug] && filter[:child_tag_slug]
                    parent_article_ids = Article.all.includes(:tagged_articles).with_parent_tags(filter[:parent_tag_slug]).ids
                    child_article_ids  = Article.all.includes(:tagged_articles).with_child_tags(filter[:child_tag_slug]).ids
                    records.where(id: parent_article_ids & child_article_ids)
                  elsif filter[:parent_tag_slug]
                    records.with_parent_tags(filter[:parent_tag_slug])
                  elsif filter[:child_tag_slug]
                    records.with_child_tags(filter[:child_tag_slug])
                  elsif filter[:tag_slug]
                    current_user && current_user.settings['tag_parent_and_child'] ? records.with_tags(filter[:tag_slug]) : records.with_no_parent_tags(filter[:tag_slug])
                  else
                    records
                  end

        records = records.where(draft: true) if filter[:draft]

        records = records.where(mode: filter[:mode]) if filter[:mode]

        return records
      end

      def filter_by_locale(current_user)
        if current_user
          self
        else
          self.with_locale(I18n.locale)
        end
      end

      def paginate_or_limit(params, current_user)
        if params[:limit].present?
          self.limit(params[:limit].to_i)
        elsif current_user&.articles_loader == 'all'
          self.all
        else
          self.paginate(page: params[:page]&.to_i, per_page: InRailsWeBlog.settings.per_page)
        end
      end
    end

    private

    def article_order(params)
      if params[:order].present?
        params[:order]
      elsif @current_user && (params[:topic_slug].present? || params[:tag_slug].present? || params[:topic_id].present? || params[:tag_id].present?)
        if @user_articles == @current_user && @topic_articles
          @topic_articles&.article_order || @current_user.article_order
        else
          @current_user.article_order
        end
      elsif @topic_articles&.stories?
        'updated_desc'
      else
        'updated_desc'
      end
    end

  end
end
