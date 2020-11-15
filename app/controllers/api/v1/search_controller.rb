# frozen_string_literal: true

module Api::V1
  class SearchController < ApiController
    skip_before_action :authenticate_user!, only: [:index, :autocomplete]

    before_action :honeypot_protection, only: [:index, :autocomplete]

    respond_to :json

    def index
      search_results = Searches::SearchService.new(search_params[:query], search_params.merge(current_user: current_user, current_admin: current_admin)).perform

      if search_results.success?
        track_action(action: 'search', query: search_params[:query], count: search_results.result[:totalCount].values.reduce(:+))

        respond_to do |format|
          set_seo_data(:search,
                       query: search_params[:query])

          format.json do
            render json: search_results.result.merge(meta: meta_attributes)
          end
        end
      else
        respond_to do |format|
          format.json do
            render json:   { errors: search_results.message },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def autocomplete
      autocomplete_results = I18n.with_locale(params[:with_locale] || I18n.locale) do
        Searches::AutocompleteService.new(search_params[:query], search_params.merge(current_user: current_user, current_admin: current_admin)).perform
      end

      if autocomplete_results.success?
        respond_to do |format|
          format.json { render json: autocomplete_results.result }
        end
      else
        respond_to do |format|
          format.json do
            render json:   { errors: autocomplete_results.message },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def url_search
      scrap_results = Searches::ScrapSearchService.new(search_params[:query_url], search_params[:article_ids]).perform

      if scrap_results.success?
        respond_to do |format|
          format.json { render json: scrap_results.result }
        end
      else
        respond_to do |format|
          format.json do
            render json:   { errors: scrap_results.message },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def meta
      admin_or_authorize

      meta_results = Searches::MetaService.new(search_params[:query], search_params.merge(current_admin: current_admin)).perform

      if meta_results.success?
        respond_to do |format|
          format.json { render json: meta_results.result }
        end
      else
        respond_to do |format|
          format.json do
            render json:   { errors: meta_results.message },
                   status: :unprocessable_entity
          end
        end
      end
    end

    private

    def search_params
      if params[:search].present?
        params.require(:search).permit(
          :query,
          :complete,
          :limit,
          :mode,
          :draft,
          :language,
          :notation,
          :visibility,
          :user_id,
          :topic_id,
          :page,
          :tag_page,
          :article_page,
          :per_page,
          :tag_per_page,
          :article_per_page,
          :order,
          :selected_types,
          :query_url,
          :article_ids,
          :global,
          :title_only,
          :no_fragment,
          selected_types: [],
          tag_ids:        [],
          tags:           [],
          topic_ids:      [],
          topics:         [],
          filters:        {}
        ).reject { |_, v| v.blank? }
      else
        {}
      end
    end
  end
end
