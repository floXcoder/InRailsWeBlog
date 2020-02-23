# frozen_string_literal: true

require 'rails_helper'

describe TopicPolicy, basic: true do

  before(:all) do
    @user = create(:user)

    @public_topic  = create(:topic, user: @user, visibility: :everyone)
    @private_topic = create(:topic, user: @user, visibility: :only_me)

    @contributed_user = create(:user)
    @share            = create(:share, user: @user, shareable: @public_topic, contributor: @contributed_user)

    @other_user = create(:user)
  end

  context 'for a public topic' do
    subject { TopicPolicy.new(user, @public_topic) }

    context 'for a visitor' do
      let(:user) { nil }

      it { should grant(:show) }

      it { should_not grant(:switch) }
      it { should_not grant(:create) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:share) }
      it { should_not grant(:destroy) }
    end

    context 'for other users' do
      let(:user) { @other_user }

      it { should grant(:show) }
      it { should grant(:create) }

      it { should_not grant(:switch) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:share) }
      it { should_not grant(:destroy) }
    end

    context 'for a contributor' do
      let(:user) { @contributed_user }

      it { should grant(:show) }
      it { should grant(:create) }
      it { should grant(:switch) }

      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:share) }
      it { should_not grant(:destroy) }
    end

    context 'for the owner' do
      let(:user) { @user }

      it { should grant(:switch) }
      it { should grant(:show) }
      it { should grant(:create) }
      it { should grant(:edit) }
      it { should grant(:update) }
      it { should grant(:share) }
      it { should grant(:destroy) }
    end
  end

  context 'for a private topic' do
    subject { TopicPolicy.new(user, @private_topic) }

    context 'for a visitor' do
      let(:user) { nil }

      it { should_not grant(:switch) }
      it { should_not grant(:show) }
      it { should_not grant(:create) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:share) }
      it { should_not grant(:destroy) }
    end

    context 'for other users' do
      let(:user) { @other_user }

      it { should grant(:create) }

      it { should_not grant(:switch) }
      it { should_not grant(:show) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:share) }
      it { should_not grant(:destroy) }
    end

    context 'for a contributor' do
      let(:user) { @contributed_user }

      it { should grant(:create) }

      it { should_not grant(:switch) }
      it { should_not grant(:show) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:share) }
      it { should_not grant(:destroy) }
    end

    context 'for the owner' do
      let(:user) { @user }

      it { should grant(:switch) }
      it { should grant(:show) }
      it { should grant(:create) }
      it { should grant(:edit) }
      it { should grant(:update) }
      it { should grant(:share) }
      it { should grant(:destroy) }
    end
  end

end
