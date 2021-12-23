# frozen_string_literal: true

require 'rails_helper'

describe Users::StoreService, type: :service do
  subject { described_class.new }

  before(:all) do
    @user = create(:user)
  end

  describe '#perform' do
    context 'with existing user' do
      it 'returns an updated user' do
        user_results = Users::StoreService.new(@user, first_name: 'updated first_name').perform

        expect(user_results.success?).to be true
        expect(user_results.result).to be_kind_of(User)
        expect(user_results.result.first_name).to eq('updated first_name')
      end
    end
  end

end
