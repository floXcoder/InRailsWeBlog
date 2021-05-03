# frozen_string_literal: true

require 'rails_helper'

describe Topics::SearchService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user = create(:user)

    @topics = create_list(:topic, 5, user: @user, description: 'Topic title')
    create_list(:topic, 3, user: @user, description: 'Topic name')

    Topic.reindex
    Topic.search_index.refresh
  end

  describe '#perform', search: true do
    context 'without options' do
      it 'returns all topics' do
        topic_results = Topics::SearchService.new('title').perform

        expect(topic_results.success?).to be true
        expect(topic_results.result[:topics]).to be_kind_of(Array)
        expect(topic_results.result[:topics].size).to eq(5)
      end
    end

    context 'with strict mode' do
      it 'returns strict topics' do
        topic_results = Topics::SearchService.new('name', format: :strict).perform

        expect(topic_results.success?).to be true
        expect(topic_results.result[:topics]).to be_kind_of(Array)
        expect(topic_results.result[:topics].size).to eq(3)
      end
    end

    context 'with ordering' do
      it 'returns ordered' do
        topic_results = Topics::SearchService.new('title', order: 'created_desc').perform

        expect(topic_results.success?).to be true
        expect(topic_results.result[:topics]).to be_kind_of(Array)
        expect(topic_results.result[:topics].size).to eq(5)
        expect(topic_results.result[:topics].first[:id]).to eq(@topics.last.id)
      end
    end
  end

end
