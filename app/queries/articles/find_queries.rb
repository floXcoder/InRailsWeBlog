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

      return @relation.none if (user_filter.present? && !@user_articles) || (topic_filter.present? && !@topic_articles)

      @relation = @relation
                    .include_collection(@topic_articles&.inventories? || @topic_articles&.stories?)
                    .with_adapted_visibility(@current_user, @current_admin)
                    .order_by(article_order(params))
                    .filter_by(params, @current_user, @user_articles, @topic_articles)
                    .paginate_or_limit(params, @current_user)

      return @relation
    end

    def stories(params = {})
      topic_filter    = { id: params[:topic_id], slug: params[:topic_slug] }.compact
      @topic_articles = Topic.find_by(topic_filter) if topic_filter.present?

      return @relation.none unless @topic_articles

      @relation = @relation
                    .include_collection
                    .with_adapted_visibility(@current_user, @current_admin)
                    .order_by(article_order(params))
                    .filter_by(params, @current_user, @user_articles, @topic_articles)
                    .paginate_or_limit(params, @current_user)

      return @relation
    end

    def home(params = {})
      @relation = @relation
                    .include_collection
                    .everyone
                    .home(params[:limit])

      return @relation
    end

    def populars(params = {})
      @relation = @relation
                    .include_collection
                    .everyone
                    .populars(params[:limit])

      return @relation
    end

    module Scopes
      def include_collection(with_topic = false)
        with_topic ? includes(:topic, :tags, :tagged_articles, user: [:picture]) : includes(:tags, :tagged_articles, user: [:picture])
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
          order('articles.priority ASC')
        when 'priority_desc'
          order('articles.priority DESC')
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
          order('tags.name ASC')
        when 'tags_desc'
          order('tags.name DESC')
        when 'rank_asc'
          joins(:tracker).order('trackers.rank ASC')
        when 'rank_desc'
          joins(:tracker).order('trackers.rank DESC')
        when 'popularity_asc'
          joins(:tracker).order('trackers.popularity ASC')
        when 'popularity_desc'
          joins(:tracker).order('trackers.popularity DESC')
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

      def paginate_or_limit(params, current_user)
        if params[:limit].present?
          self.limit(params[:limit])
        elsif current_user&.articles_loader == 'all'
          self.all
        else
          self.paginate(page: params[:page], per_page: InRailsWeBlog.config.per_page)
        end
      end
    end

    private

    def article_order(params)
      if params[:order].present?
        params[:order]
      elsif @current_user
        if @user_articles == @current_user && @topic_articles
          @topic_articles&.article_order || @current_user.article_order
        else
          @current_user.article_order
        end
      else
        'priority_desc'
      end
    end

  end
end
