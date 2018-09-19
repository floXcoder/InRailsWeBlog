# frozen_string_literal: true

require 'rails_helper'

describe Topics::StoreService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user  = create(:user)

    @topic = create(:topic, user: @user)
  end

  describe '#perform' do
    context 'with new topic' do
      it 'returns a new topic' do
        topic         = @user.topics.build
        topic_results = Topics::StoreService.new(topic, name: 'new name').perform

        expect(topic_results.success?).to be true
        expect(topic_results.result).to be_kind_of(Topic)
        expect(topic_results.result.name).to eq('new name')
      end
    end

    context 'with existing topic' do
      it 'returns an updated topic' do
        topic_results = Topics::StoreService.new(@topic, name: 'updated name').perform

        expect(topic_results.success?).to be true
        expect(topic_results.result).to be_kind_of(Topic)
        expect(topic_results.result.name).to eq('updated name')
      end
    end
  end

end
