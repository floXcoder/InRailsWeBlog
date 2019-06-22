# frozen_string_literal: true

module Topics
  class StoreInventoryFieldsService < BaseService
    def initialize(topic, *args)
      super(*args)

      @topic = topic
    end

    def perform
      field_names_changed = {}

      unless @params[:fields].nil?
        inventory_fields = @params[:fields].map do |field|
          if (inventory_field = @topic.inventory_fields.with_deleted.where(field_name: field[:field_name]).or(@topic.inventory_fields.with_deleted.where(name: field[:name])).first)
            field_names_changed[field[:field_name]] = field[:name].to_s.parameterize.underscore if field[:field_name] != field[:name].to_s.parameterize.underscore

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
        update_article(field_names_changed) if field_names_changed.present?

        success(@topic.reload, I18n.t('views.inventory_field.flash.successful_edition'))
      else
        error(I18n.t('views.inventory_field.flash.error_edition'), @topic.errors)
      end
    end

    private

    def update_article(field_names_changed)
      return if field_names_changed.blank?

      @topic.articles.each do |article|
        field_names_changed.each do |old_field_name, new_field_name|
          next unless article.inventories.key?(old_field_name)

          article.inventories[new_field_name] = article.inventories.delete(old_field_name)
          article.save
        end
      end
    end

  end
end
