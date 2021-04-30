# frozen_string_literal: true

require 'rails_helper'

describe Topics::AutocompleteService, type: :service, basic: true do
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
        topic_autocompletes = Topics::AutocompleteService.new('tit').perform

        expect(topic_autocompletes.success?).to be true
        expect(topic_autocompletes.result[:topics]).to be_kind_of(Array)
        expect(topic_autocompletes.result[:topics].size).to eq(5)
      end
    end
  end
end
