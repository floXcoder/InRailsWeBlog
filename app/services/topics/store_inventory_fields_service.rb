# frozen_string_literal: true

module Topics
  class StoreInventoryFieldsService < BaseService
    def initialize(topic, *args)
      super(*args)

      @topic = topic
    end

    def perform
      unless @params[:fields].nil?
        inventory_fields = @params[:fields].map do |field|
          if (inventory_field = @topic.inventory_fields.with_deleted.where(field_name: field[:field_name]).or(@topic.inventory_fields.with_deleted.where(name: field[:name])).first)
            inventory_field.assign_attributes(field)
            inventory_field.deleted_at = nil
            inventory_field
          else
            @topic.inventory_fields.build(field)
          end
        end

        @topic.inventory_fields = inventory_fields
      end

      if @topic.save
        success(@topic.reload, I18n.t('views.inventory_field.flash.successful_edition'))
      else
        error(I18n.t('views.inventory_field.flash.error_edition'), @topic.errors)
      end
    end

  end
end
