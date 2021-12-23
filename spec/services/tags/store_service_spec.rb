# frozen_string_literal: true

require 'rails_helper'

describe Tags::StoreService, type: :service do
  subject { described_class.new }

  before(:all) do
    @user = create(:user)

    @tag = create(:tag, user: @user, visibility: 'only_me')
    @public_tag = create(:tag, user: @user, visibility: 'everyone')
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

      it 'prevents to change tag visibility if public' do
        tag_results = Tags::StoreService.new(@public_tag, visibility: 'only_me').perform

        expect(tag_results.success?).to be false
        expect(tag_results.errors.full_messages.first).to include(I18n.t('activerecord.errors.models.tag.public_visibility_immutable'))
      end
    end
  end

end
