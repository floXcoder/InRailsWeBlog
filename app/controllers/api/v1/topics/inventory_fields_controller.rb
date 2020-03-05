# frozen_string_literal: true

module Api::V1
  class Topics::InventoryFieldsController < ApiController
    before_action :set_context_user

    after_action :verify_authorized

    include TrackerConcern

    respond_to :json

    def create
      topic = Topic.find(params[:topic_id])
      authorize topic, :update?

      inventory_topic = ::Topics::StoreInventoryFieldsService.new(topic, inventory_field_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          if inventory_topic.success?
            flash.now[:success] = inventory_topic.message
            render json:   TopicCompleteSerializer.new(inventory_topic.result,
                                                       include: [:user, :tags, :contributors, :tracker]).serializable_hash,
                   status: :ok
          else
            flash.now[:error] = inventory_topic.message
            render json:   { errors: inventory_topic.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    private

    def inventory_field_params
      if params[:inventory_field].present?
        params.require(:inventory_field).permit(
          fields: [
                    :field_name,
                    :name,
                    :value_type,
                    :parent_category,
                    :required,
                    :searchable,
                    :filterable,
                    :priority,
                    :visibility
                  ]
        )
      else
        {}
      end
    end

  end
end
