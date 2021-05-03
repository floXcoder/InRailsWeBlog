# frozen_string_literal: true

require 'rails_helper'

describe Tags::SearchService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user = create(:user)

    @tags = create_list(:tag, 5, user: @user, description: 'Tag title')
    create_list(:tag, 3, user: @user, description: 'Tag name')

    Tag.reindex
    Tag.search_index.refresh
  end

  describe '#perform', search: true do
    context 'without options' do
      it 'returns all tags' do
        tag_results = Tags::SearchService.new('title').perform

        expect(tag_results.success?).to be true
        expect(tag_results.result[:tags]).to be_kind_of(Array)
        expect(tag_results.result[:tags].size).to eq(5)
      end
    end

    context 'with strict mode' do
      it 'returns strict tags' do
        tag_results = Tags::SearchService.new('name', format: :strict).perform

        expect(tag_results.success?).to be true
        expect(tag_results.result[:tags]).to be_kind_of(Array)
        expect(tag_results.result[:tags].size).to eq(3)
      end
    end

    context 'with ordering' do
      it 'returns ordered' do
        tag_results = Tags::SearchService.new('title', order: 'created_desc').perform

        expect(tag_results.success?).to be true
        expect(tag_results.result[:tags]).to be_kind_of(Array)
        expect(tag_results.result[:tags].size).to eq(5)
        expect(tag_results.result[:tags].first[:id]).to eq(@tags.last.id)
      end
    end
  end

end
