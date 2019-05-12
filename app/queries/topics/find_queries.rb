# frozen_string_literal: true

module Topics
  class FindQueries < BaseQuery
    attr_reader :relation

    def initialize(current_user = nil, current_admin = nil, relation = Topic.all)
      super(current_user, current_admin)

      @relation = relation.extending(Scopes)
    end

    def all(params = {})
      @relation = @relation
                    .with_adapted_visibility(@current_user, @current_admin)
                    .filter_by(params, @current_user)
                    .order_by(params[:order] || 'name')
                    .distinct

      return @relation
    end

    module Scopes
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
          order('topics.name ASC')
        when 'priority_asc'
          order('topics.priority ASC')
        when 'priority_desc'
          order('topics.priority DESC')
        when 'id_asc'
          order('topics.id ASC')
        when 'id_desc'
          order('topics.id DESC')
        when 'created_asc'
          order('topics.created_at ASC')
        when 'created_desc'
          order('topics.created_at DESC')
        when 'updated_asc'
          order('topics.updated_at ASC')
        when 'updated_desc'
          order('topics.updated_at DESC')
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

        records = records.from_user(filter[:user_id], current_user&.id) if filter[:user_id]

        records = records.bookmarked_by_user(current_user.id) if filter[:bookmarked] && current_user

        records = records.where(accepted: filter[:accepted]) if filter[:accepted]
        records = records.with_visibility(filter[:visibility]) if filter[:visibility]

        return records
      end

      def paginate_or_limit(params)
        params[:limit] ? self.limit(params[:limit]) : self
      end

    end

  end
end
