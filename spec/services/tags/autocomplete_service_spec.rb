# frozen_string_literal: true

require 'rails_helper'

describe Tags::AutocompleteService, type: :service, basic: true do
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
        tag_autocompletes = Tags::AutocompleteService.new('tit').perform

        expect(tag_autocompletes.success?).to be true
        expect(tag_autocompletes.result[:tags]).to be_kind_of(Array)
        expect(tag_autocompletes.result[:tags].size).to eq(5)
      end
    end
  end
end
