# frozen_string_literal: true

module Topics
  class FindQueries
    attr_reader :relation

    def initialize(relation = Topic.all)
      @relation = relation.extending(Scopes)
    end

    def all(params = {}, current_user = nil, current_admin = nil)
      @relation = @relation
                    .order('topics.name ASC')
                    .distinct
                    .with_adapted_visibility(current_user, current_admin)
                    .filter_by(params, current_user)

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
        when 'id_asc'
          order('id ASC')
        when 'id_desc'
          order('id DESC')
        when 'created_asc'
          order('created_at ASC')
        when 'created_desc'
          order('created_at DESC')
        when 'updated_asc'
          order('updated_at ASC')
        when 'updated_desc'
          order('updated_at DESC')
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
