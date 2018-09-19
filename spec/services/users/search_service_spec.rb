# frozen_string_literal: true

require 'rails_helper'

describe Users::SearchService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user_with_pseudo = create(:user, pseudo: 'User pseudo')
    @user_with_name   = create(:user, pseudo: 'User name')

    User.reindex
    User.search_index.refresh
  end

  describe '#perform', search: true do
    context 'without options' do
      it 'returns all users' do
        user_results = Users::SearchService.new('pseudo').perform

        expect(user_results.success?).to be true
        expect(user_results.result[:users]).to be_kind_of(Array)
        expect(user_results.result[:users].size).to eq(1)
      end
    end

    context 'with strict mode' do
      it 'returns strict users' do
        user_results = Users::SearchService.new('name', format: :strict).perform

        expect(user_results.success?).to be true
        expect(user_results.result[:users]).to be_kind_of(Array)
        expect(user_results.result[:users].size).to eq(1)
      end
    end

    context 'with ordering' do
      it 'returns ordered' do
        user_results = Users::SearchService.new('user', order: 'created_desc').perform

        expect(user_results.success?).to be true
        expect(user_results.result[:users]).to be_kind_of(Array)
        expect(user_results.result[:users].size).to eq(2)
        expect(user_results.result[:users].first[:id]).to eq(@user_with_name.id)
      end
    end
  end

end
