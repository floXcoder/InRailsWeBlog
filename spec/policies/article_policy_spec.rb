# frozen_string_literal: true

require 'rails_helper'

describe ArticlePolicy, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @public_article  = create(:article, user: @user, topic: @topic, visibility: :everyone)
    @private_article = create(:article, user: @user, topic: @topic, visibility: :only_me)

    @contributed_user = create(:user)
    @share            = create(:share, mode: :with_user, user: @user, shareable: @topic, contributor: @contributed_user)

    @shared_link = create(:share, mode: :link, user: @user, shareable: @private_article)

    @other_user = create(:user)
  end

  context 'for a public article' do
    subject { ArticlePolicy.new(user, @public_article) }

    context 'for a visitor' do
      let(:user) { nil }

      it { should grant(:show) }
      it { should grant(:recommendations) }

      it { should_not grant(:shared) }
      it { should_not grant(:history) }
      it { should_not grant(:tracking) }
      it { should_not grant(:create) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:share) }
      it { should_not grant(:check_links) }
      it { should_not grant(:restore) }
      it { should_not grant(:destroy) }
      it { should_not grant(:vote_up) }
      it { should_not grant(:vote_down) }
      it { should_not grant(:add_outdated) }
      it { should_not grant(:remove_outdated) }
      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
    end

    context 'for another user' do
      let(:user) { @other_user }

      it { should grant(:show) }
      it { should grant(:recommendations) }
      it { should grant(:create) }
      it { should grant(:vote_up) }
      it { should grant(:vote_down) }
      it { should grant(:add_outdated) }
      it { should grant(:remove_outdated) }
      it { should grant(:add_comment) }
      it { should grant(:update_comment) }
      it { should grant(:remove_comment) }

      it { should_not grant(:shared) }
      it { should_not grant(:tracking) }
      it { should_not grant(:history) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:share) }
      it { should_not grant(:check_links) }
      it { should_not grant(:restore) }
      it { should_not grant(:destroy) }
    end

    context 'for a contributor' do
      let(:user) { @contributed_user }

      it { should grant(:show) }
      it { should grant(:recommendations) }
      it { should grant(:history) }
      it { should grant(:create) }
      it { should grant(:edit) }
      it { should grant(:update) }
      it { should grant(:restore) }
      it { should grant(:add_outdated) }
      it { should grant(:remove_outdated) }
      it { should grant(:vote_up) }
      it { should grant(:vote_down) }
      it { should grant(:add_comment) }
      it { should grant(:update_comment) }
      it { should grant(:remove_comment) }

      it { should_not grant(:shared) }
      it { should_not grant(:tracking) }
      it { should_not grant(:share) }
      it { should_not grant(:check_links) }
      it { should_not grant(:destroy) }
    end

    context 'for the owner' do
      let(:user) { @user }

      it { should grant(:show) }
      it { should grant(:recommendations) }
      it { should grant(:shared) }
      it { should grant(:tracking) }
      it { should grant(:history) }
      it { should grant(:create) }
      it { should grant(:edit) }
      it { should grant(:update) }
      it { should grant(:share) }
      it { should grant(:check_links) }
      it { should grant(:restore) }
      it { should grant(:destroy) }
      it { should grant(:add_outdated) }
      it { should grant(:remove_outdated) }

      it { should_not grant(:vote_up) }
      it { should_not grant(:vote_down) }
      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
    end
  end

  context 'for a private article' do
    subject { ArticlePolicy.new(user, @private_article) }

    context 'for a visitor' do
      let(:user) { nil }

      it { should_not grant(:show) }
      it { should_not grant(:recommendations) }
      it { should_not grant(:shared) }
      it { should_not grant(:tracking) }
      it { should_not grant(:history) }
      it { should_not grant(:create) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:share) }
      it { should_not grant(:check_links) }
      it { should_not grant(:restore) }
      it { should_not grant(:destroy) }
      it { should_not grant(:vote_up) }
      it { should_not grant(:vote_down) }
      it { should_not grant(:add_outdated) }
      it { should_not grant(:remove_outdated) }
      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
    end

    context 'for a visitor with shared link' do
      let(:user) { nil }

      before do
        @private_article.shared_link = @shared_link.public_link
      end

      after do
        @private_article.shared_link = nil
      end

      it { should grant(:shared) }

      it { should_not grant(:show) }
      it { should_not grant(:recommendations) }
      it { should_not grant(:history) }
      it { should_not grant(:tracking) }
      it { should_not grant(:create) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:share) }
      it { should_not grant(:check_links) }
      it { should_not grant(:restore) }
      it { should_not grant(:destroy) }
      it { should_not grant(:vote_up) }
      it { should_not grant(:vote_down) }
      it { should_not grant(:add_outdated) }
      it { should_not grant(:remove_outdated) }
      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
    end

    context 'for another user' do
      let(:user) { @other_user }

      it { should grant(:create) }

      it { should_not grant(:show) }
      it { should_not grant(:recommendations) }
      it { should_not grant(:shared) }
      it { should_not grant(:tracking) }
      it { should_not grant(:vote_up) }
      it { should_not grant(:vote_down) }
      it { should_not grant(:add_outdated) }
      it { should_not grant(:remove_outdated) }
      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
      it { should_not grant(:history) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:share) }
      it { should_not grant(:check_links) }
      it { should_not grant(:restore) }
      it { should_not grant(:destroy) }
    end

    context 'for a contributor' do
      let(:user) { @contributed_user }

      it { should grant(:show) }
      it { should grant(:recommendations) }
      it { should grant(:history) }
      it { should grant(:create) }
      it { should grant(:edit) }
      it { should grant(:update) }
      it { should grant(:restore) }
      it { should grant(:add_outdated) }
      it { should grant(:remove_outdated) }

      it { should_not grant(:shared) }
      it { should_not grant(:tracking) }
      it { should_not grant(:share) }
      it { should_not grant(:check_links) }
      it { should_not grant(:destroy) }
      it { should_not grant(:vote_up) }
      it { should_not grant(:vote_down) }
      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
    end

    context 'for the owner' do
      let(:user) { @user }

      it { should grant(:show) }
      it { should grant(:recommendations) }
      it { should grant(:shared) }
      it { should grant(:tracking) }
      it { should grant(:history) }
      it { should grant(:create) }
      it { should grant(:edit) }
      it { should grant(:update) }
      it { should grant(:share) }
      it { should grant(:check_links) }
      it { should grant(:restore) }
      it { should grant(:destroy) }
      it { should grant(:add_outdated) }
      it { should grant(:remove_outdated) }

      it { should_not grant(:vote_up) }
      it { should_not grant(:vote_down) }
      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
    end
  end

end
