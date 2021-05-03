# frozen_string_literal: true

require 'rails_helper'

describe Tags::StoreService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user = create(:user)

    @tag = create(:tag, user: @user, visibility: 'only_me')
  end

  describe '#perform' do
    context 'with new tag' do
      it 'returns a new tag' do
        tag         = @user.tags.build
        tag_results = Tags::StoreService.new(tag, name: 'new tag').perform

        expect(tag_results.success?).to be true
        expect(tag_results.result).to be_kind_of(Tag)
        expect(tag_results.result.name).to eq('new tag')
      end
    end

    context 'with existing tag' do
      it 'returns an updated tag' do
        tag_results = Tags::StoreService.new(@tag, name: 'updated content').perform

        expect(tag_results.success?).to be true
        expect(tag_results.result).to be_kind_of(Tag)
        expect(tag_results.result.name).to eq('updated content')
      end
    end
  end

end
