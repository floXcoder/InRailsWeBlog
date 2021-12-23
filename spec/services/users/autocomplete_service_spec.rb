# frozen_string_literal: true

require 'rails_helper'

describe Users::AutocompleteService, type: :service do
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
        user_autocompletes = Users::AutocompleteService.new('use').perform

        expect(user_autocompletes.success?).to be true
        expect(user_autocompletes.result[:users]).to be_kind_of(Array)
        expect(user_autocompletes.result[:users].size).to eq(2)
      end
    end
  end
end
