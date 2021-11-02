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
                    .order_by(params[:order] || 'name').order_by('created_desc')
                    .distinct

      return @relation
    end

    def complete(_params = {})
      @relation = @relation
                    .includes(:inventory_fields, :user, :tracker, :shares, :contributors)
                    .with_adapted_visibility(@current_user, @current_admin)
                    .order_by('name').order_by('created_desc')
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
          order('topics.name ASC NULLS LAST')
        when 'priority_asc'
          order('topics.priority ASC NULLS LAST')
        when 'priority_desc'
          order('topics.priority DESC NULLS LAST')
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

      def filter_by(filter, current_user = nil)
        return self if filter.blank?

        return self
                 .then { |relation| filter[:user_id] ? relation.from_user(filter[:user_id], current_user&.id) : relation }
                 .then { |relation| filter[:bookmarked] && current_user ? bookmarked_by_user(current_user.id) : relation }
                 .then { |relation| filter[:accepted] ? relation.where(accepted: filter[:accepted]) : relation }
                 .then { |relation| filter[:visibility] ? relation.with_visibility(filter[:visibility]) : relation }
      end

      def paginate_or_limit(params)
        params[:limit].present? ? self.limit(params[:limit].to_i) : self
      end

    end

  end
end
