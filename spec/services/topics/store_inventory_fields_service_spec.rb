# frozen_string_literal: true

require 'rails_helper'

describe Topics::StoreInventoryFieldsService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user = create(:user)

    @topic = create(:topic, user: @user, mode: :inventories)
  end

  describe '#perform' do
    let(:field_attributes) {
      [
        {
          name:       'String',
          value_type: 'string_type'
        },
        {
          name:       'Text',
          value_type: 'text_type'
        }
      ]
    }

    let(:updated_field_attributes) {
      [
        {
          field_name: 'string',
          name:       'String 2',
          value_type: 'string_type'
        },
        {
          name:       'Text 2',
          value_type: 'text_type'
        }
      ]
    }

    let(:error_field_attributes) {
      [
        {
          value_type: 'string_type'
        },
        {
          name: 'Text 2'
        }
      ]
    }

    it 'adds new fields to topic inventories' do
      expect {
        inventory_fields_results = Topics::StoreInventoryFieldsService.new(
          @topic,
          fields:       field_attributes,
          current_user: @user).perform

        expect(inventory_fields_results.success?).to be true
        expect(inventory_fields_results.result).to be_kind_of(Topic)
        expect(inventory_fields_results.result.inventory_fields.first.name).not_to be_empty
      }.to change(Topic::InventoryField, :count).by(field_attributes.size)
    end

    it 'updates existing fields to topic inventories' do
      Topics::StoreInventoryFieldsService.new(@topic, fields: field_attributes, current_user: @user).perform

      expect {
        inventory_fields_results = Topics::StoreInventoryFieldsService.new(
          @topic,
          fields:       updated_field_attributes,
          current_user: @user).perform

        expect(inventory_fields_results.success?).to be true
        expect(inventory_fields_results.result).to be_kind_of(Topic)
        expect(inventory_fields_results.result.inventory_fields.first.name).not_to be_empty
        expect(inventory_fields_results.result.inventory_fields.last.name).not_to be_empty
      }.to_not change(Topic::InventoryField, :count)
    end

    it 'removes useless fields to topic inventories' do
      Topics::StoreInventoryFieldsService.new(@topic, fields: field_attributes, current_user: @user).perform

      expect {
        inventory_fields_results = Topics::StoreInventoryFieldsService.new(
          @topic,
          fields:       updated_field_attributes.first(1),
          current_user: @user).perform

        expect(inventory_fields_results.success?).to be true
        expect(inventory_fields_results.result).to be_kind_of(Topic)
        expect(inventory_fields_results.result.inventory_fields.first.name).to eq('String 2')
      }.to change(Topic::InventoryField, :count).by(-1)
    end

    it 'can reuse an old field to topic inventories' do
      Topics::StoreInventoryFieldsService.new(@topic, fields: field_attributes, current_user: @user).perform
      Topics::StoreInventoryFieldsService.new(@topic, fields: updated_field_attributes.last(1), current_user: @user).perform

      expect {
        inventory_fields_results = Topics::StoreInventoryFieldsService.new(
          @topic,
          fields:       updated_field_attributes.first(1),
          current_user: @user).perform

        expect(inventory_fields_results.success?).to be true
        expect(inventory_fields_results.result).to be_kind_of(Topic)
        expect(inventory_fields_results.result.inventory_fields.last.name).to eq('String 2')
      }.to_not change(Topic::InventoryField, :count)
    end

    it 'raises an error if name or value_type are empty' do
      expect {
        inventory_fields_results = Topics::StoreInventoryFieldsService.new(
          @topic,
          fields:       error_field_attributes,
          current_user: @user).perform

        expect(inventory_fields_results.success?).to be false

        expect(inventory_fields_results.errors.messages).to have_key(:"inventory_fields.name")
        expect(inventory_fields_results.errors.messages).to have_key(:"inventory_fields.field_name")
      }.not_to change(Topic::InventoryField, :count)
    end

  end

end
