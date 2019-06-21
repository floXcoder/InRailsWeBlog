# frozen_string_literal: true

require 'rails_helper'

describe Topics::FindQueries, type: :query, basic: true do
  subject { described_class.new }

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
    @admin      = create(:admin)

    @topic = create(:topic, user: @user)

    @topics       = create_list(:topic, 5, user: @user)
    @second_topic = create(:topic, user: @user)

    @private_topic = create(:topic, user: @user, visibility: 'only_me')

    @other_topics = create_list(:topic, 3, user: @other_user)
  end

  describe '#all' do
    context 'without params' do
      it 'returns all public topics' do
        topics = ::Topics::FindQueries.new.all

        expect(topics.count).to eq(Topic.everyone.count)
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all public topics and user topics' do
        topics = ::Topics::FindQueries.new(@user).all({})

        expect(topics.count).to eq(Topic.everyone_and_user(@user.id).count)
      end

      it 'returns all user topics for a user id' do
        topics = ::Topics::FindQueries.new(@user).all(user_id: @user.id)

        expect(topics.count).to eq(Topic.from_user(@user.id, @user.id).count)
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all public topics and user topics' do
        topics = ::Topics::FindQueries.new(@user, @admin).all({})

        expect(topics.count).to eq(Topic.all.count)
      end
    end

    context 'with filter params' do
      it { expect(::Topics::FindQueries.new.all(accepted: true)).to include(@topic) }
    end
  end

end
