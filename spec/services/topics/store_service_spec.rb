# frozen_string_literal: true

require 'rails_helper'

describe Topics::StoreService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user = create(:user)

    @topic = create(:topic, user: @user, visibility: 'only_me')
  end

  describe '#perform' do
    context 'with new topic' do
      it 'returns a new topic' do
        topic        = @user.topics.build
        topic_result = Topics::StoreService.new(topic, name: 'new name').perform

        expect(topic_result.success?).to be true
        expect(topic_result.result).to be_kind_of(Topic)
        expect(topic_result.result.name).to eq('new name')
      end
    end

    context 'with existing topic' do
      it 'returns an updated topic' do
        topic_result = Topics::StoreService.new(@topic, name: 'updated name').perform

        expect(topic_result.success?).to be true
        expect(topic_result.result).to be_kind_of(Topic)
        expect(topic_result.result.name).to eq('updated name')
      end

      it 'prevents to change topic visibility' do
        topic_results = Topics::StoreService.new(@topic, visibility: 'everyone').perform

        expect(topic_results.success?).to be false
        expect(topic_results.errors.full_messages.first).to include(I18n.t('activerecord.errors.models.topic.public_visibility_immutable'))
      end
    end
  end

end
