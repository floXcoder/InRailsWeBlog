# frozen_string_literal: true

module Articles
  class FindQueries
    attr_reader :relation

    def initialize(relation = Article.all)
      @relation = relation.extending(Scopes)
    end

    def all(params = {}, current_user = nil, current_admin = nil)
      @relation = @relation
                    .include_collection
                    .with_adapted_visibility(current_user, current_admin)
                    .order_by(filter_articles(params))
                    .filter_by(params, current_user)
                    .paginate_or_limit(params)

      return @relation
    end

    module Scopes
      def include_collection
        includes(:tags, :tagged_articles, user: [:picture])
      end

      def include_element
        includes(:user, :parent_tags, :child_tags, :tagged_articles, :tracker)
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

      def filter_by(filter, current_user = nil)
        return self unless filter.present?

        records = self

        records = records.where(id: filter[:article_ids]) if filter[:article_ids]

        records = records.where(accepted: filter[:accepted]) if filter[:accepted]
        records = records.with_visibility(filter[:visibility]) if filter[:visibility]

        if filter[:bookmarked] && current_user
          records = records.bookmarked_by_user(current_user.id)
        else
          if filter[:user_id]
            records = records.from_user_id(filter[:user_id], current_user&.id)
          elsif filter[:user_slug]
            records = records.from_user(filter[:user_slug], current_user&.id)
          end

          if filter[:topic_id]
            records = records.from_topic_id(filter[:topic_id]) if filter[:topic_id]
          elsif filter[:topic_slug]
            records = records.from_topic(filter[:topic_slug])
          end
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
                    current_user && current_user.settings['article_child_tagged'] ? records.with_tags(filter[:tag_slug]) : records.with_no_parent_tags(filter[:tag_slug])
                  else
                    records
                  end

        records = records.where(draft: true) if filter[:draft]

        records = records.where(mode: filter[:mode]) if filter[:mode]

        return records
      end

      def paginate_or_limit(params)
        params[:limit] ? self.limit(params[:limit]) : self.paginate(page: params[:page], per_page: Setting.per_page)
      end
    end

    private

    def filter_articles(params)
      if params[:order]
        if @current_user && @current_user.article_order != params[:order]
          @current_user.settings['article_order'] = params[:order]
          @current_user.save
        end

        params[:order]
      elsif @current_user&.article_order
        @current_user.article_order
      else
        'priority_desc'
      end
    end

  end
end
