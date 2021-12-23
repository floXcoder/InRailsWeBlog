# frozen_string_literal: true

require 'rails_helper'

describe 'Topic Inventory Fields API', type: :request do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)

    @topic = create(:topic, user: @user)
  end

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
        field_name: 'text',
        name:       'Text',
        value_type: 'text_type'
      }
    ]
  }

  let(:field_attributes_error_attributes) {
    [
      {
        value_type: 'string_type'
      }
    ]
  }

  describe '/api/v1/topics/:topic_id/inventory_fields (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post "/api/v1/topics/#{@topic.id}/inventory_fields", params: field_attributes, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the updated topic with new inventory fields' do
        expect {
          post "/api/v1/topics/#{@topic.id}/inventory_fields", params: { fields: field_attributes }, as: :json

          expect(response).to be_json_response(200)

          topic = JSON.parse(response.body)
          expect(topic['data']).not_to be_empty
          expect(topic['data']['attributes']).not_to be_empty
          #expect(topic['data']['attributes'].last['name']).to eq(field_attributes.first[:name])
        }.to change(Topic::InventoryField, :count).by(2)
      end

      it 'returns the updated topic with updated inventory fields' do
        Topics::StoreInventoryFieldsService.new(@topic, fields: field_attributes, current_user: @user).perform

        expect {
          post "/api/v1/topics/#{@topic.id}/inventory_fields", params: { fields: updated_field_attributes }, as: :json

          expect(response).to be_json_response(200)

          topic = JSON.parse(response.body)
          expect(topic['data']).not_to be_empty
          expect(topic['data']['attributes']).not_to be_empty
          #expect(topic['data']['attributes'].first['name']).to eq(updated_field_attributes.first[:name])
        }.not_to change(Topic::InventoryField, :count)
      end
    end

    context 'when updating inventory fields with errors' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the errors and stay on the same topic' do
        expect {
          post "/api/v1/topics/#{@topic.id}/inventory_fields", params: { fields: field_attributes_error_attributes }, as: :json

          expect(response).to be_json_response(422)

          topic = JSON.parse(response.body)
          expect(topic['errors']['inventory_fields.field_name'].first).to eq(I18n.t('errors.messages.blank'))
        }.not_to change(Topic::InventoryField, :count)
      end
    end
  end

end
