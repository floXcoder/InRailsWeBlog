# frozen_string_literal: true

require 'rails_helper'

describe UserPolicy do

  before(:all) do
    @user = create(:user)
    @other_user = create(:user)
  end

  context 'for a visitor' do
    let(:current_user) { nil }
    let(:user) { nil }

    subject { UserPolicy.new(user, @user) }

    it { should grant(:show) }

    it { should_not grant(:bookmarks) }
    it { should_not grant(:draft) }
    it { should_not grant(:comments) }
    it { should_not grant(:edit) }
    it { should_not grant(:update) }
    it { should_not grant(:destroy) }
    it { should_not grant(:settings) }
  end

  context 'for another user' do
    let(:user) { @other_user }

    subject { UserPolicy.new(user, @user) }

    it { should grant(:show) }

    it { should_not grant(:bookmarks) }
    it { should_not grant(:draft) }
    it { should_not grant(:comments) }
    it { should_not grant(:edit) }
    it { should_not grant(:update) }
    it { should_not grant(:destroy) }
    it { should_not grant(:settings) }
  end

  context 'for the current user' do
    let(:user) { @user }

    subject { UserPolicy.new(user, @user) }

    it { should grant(:bookmarks) }
    it { should grant(:draft) }
    it { should grant(:comments) }
    it { should grant(:show) }
    it { should grant(:edit) }
    it { should grant(:update) }
    it { should grant(:destroy) }
    it { should grant(:settings) }
  end
end
