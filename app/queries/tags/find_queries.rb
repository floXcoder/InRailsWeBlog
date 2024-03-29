# frozen_string_literal: true

module Tags
  class FindQueries < BaseQuery
    attr_reader :relation

    def initialize(current_user = nil, current_admin = nil, relation = Tag.all)
      super(current_user, current_admin)

      @relation = relation.extending(Scopes)
    end

    def all(params = {})
      filter_by_topic = [params[:topic_id], params[:topic_slug]].compact.present?

      @relation = @relation
                    .include_collection(filter_by_topic: filter_by_topic)
                    .with_adapted_visibility(@current_user, @current_admin)
                    .order_by(params[:order] || 'name').order_by('created_desc')
                    .filter_by(params, @current_user)
                    .distinct
                    .paginate_or_limit(params)

      return @relation
    end

    def complete(_params = {})
      @relation = @relation
                    .includes(:user, :parents, :children, :tracker)
                    .with_adapted_visibility(@current_user, @current_admin)
                    .order_by('name').order_by('created_desc')
                    .distinct

      return @relation
    end

    def populars(params = {})
      @relation = @relation
                    .include_collection
                    .select('distinct trackers.popularity, tags.id, tags.name, tags.slug, tags.updated_at, tags.user_id, tags.description_translations, tags.languages, tags.synonyms, tags.priority, tags.visibility, tags.tagged_articles_count')
                    .everyone
                    .left_outer_joins(:articles).where('articles.languages @> ?', "{#{I18n.locale}}")
                    .populars(params[:limit])

      return @relation
    end

    module Scopes
      def include_collection(filter_by_topic: false)
        filter_by_topic ? includes(:parent_relationships, :child_relationships, :tagged_articles) : includes(:child_relationships, :tagged_articles)
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
        when 'name'
          order('tags.name ASC NULLS LAST')
        when 'priority_asc'
          order('tags.priority ASC NULLS LAST')
        when 'priority_desc'
          order('tags.priority DESC NULLS LAST')
        when 'id_asc'
          order('tags.id ASC')
        when 'id_desc'
          order('tags.id DESC')
        when 'created_asc'
          order('tags.created_at ASC')
        when 'created_desc'
          order('tags.created_at DESC')
        when 'updated_asc'
          order('tags.updated_at ASC')
        when 'updated_desc'
          order('tags.updated_at DESC')
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

      # When filtering by topic, private tags not assigned to an article are not returned
      def filter_by(filter, current_user = nil)
        return self if filter.blank?

        records = self

        records = records.where(id: filter[:tag_ids]) if filter[:tag_ids]

        if filter[:user_id]
          records = records.from_user_id(filter[:user_id], current_user&.id)
        elsif filter[:user_slug]
          records = records.from_user(filter[:user_slug], current_user&.id)
        end

        if filter[:topic_id]
          records = records.for_topic_id(filter[:topic_id]) if filter[:topic_id]
        elsif filter[:topic_slug]
          records = records.for_topic(filter[:topic_slug])
        end

        records = records.bookmarked_by_user(current_user.id) if filter[:bookmarked] && current_user

        records = records.where(accepted: filter[:accepted]) if filter[:accepted]
        records = records.with_visibility(filter[:visibility]) if filter[:visibility]

        return records
      end

      def paginate_or_limit(params)
        params[:limit].present? ? self.limit(params[:limit].to_i) : self
      end

    end

  end
end
