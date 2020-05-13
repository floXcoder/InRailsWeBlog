# frozen_string_literal: true

module Api::V1
  class ExporterController < ApiController
    respond_to :zip, :json

    def index
      export_results = Shared::ExporterService.new(params[:user_id]).perform

      if export_results.success?
        respond_to do |format|
          format.zip { send_file export_results.result }
        end
      else
        respond_to do |format|
          format.json do
            render json:   { errors: export_results.message },
                   status: :unprocessable_entity
          end
        end
      end
    end

  end
end
