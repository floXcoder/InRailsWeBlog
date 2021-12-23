# frozen_string_literal: true

# == Schema Information
#
# Table name: bookmarks
#
#  id              :bigint           not null, primary key
#  user_id         :bigint           not null
#  bookmarked_type :string           not null
#  bookmarked_id   :bigint           not null
#  follow          :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  topic_id        :bigint
#
require 'rails_helper'

RSpec.describe Bookmark, type: :model do

  before(:all) do
    @user       = create(:user)
    @topic      = create(:topic, user: @user)
    @bookmarked = create(:article, user: @user, topic: @topic)
  end

  before do
    @bookmark = Bookmark.create(
      user:       @user,
      bookmarked: @bookmarked
    )
  end

  subject { @bookmark }

  context 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:bookmarked) }

    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to validate_presence_of(:bookmarked) }

    it { is_expected.to validate_uniqueness_of(:user_id).scoped_to([:bookmarked_id, :bookmarked_type]).with_message(I18n.t('activerecord.errors.models.bookmark.already_bookmarked')) }
  end

  context 'Public Methods' do
    subject { Bookmark }

    let(:user) { create(:user) }
    let(:other_user) { create(:user) }

    let(:topic) { create(:topic, user: user) }
    let(:other_topic) { create(:topic, user: other_user) }

    let(:article) { create(:article, user: user, topic: topic) }
    let(:other_article) { create(:article, user: other_user, topic: other_topic) }

    let(:tag) { create(:tag, user: user) }
    let(:other_tag) { create(:tag, user: other_user) }

    let!(:user_bookmarked) { create(:bookmark, user: user, bookmarked: user) }
    let!(:article_bookmarked) { create(:bookmark, user: user, bookmarked: article) }
    let!(:tag_bookmarked) { create(:bookmark, user: user, bookmarked: tag) }

    describe '::users' do
      it { is_expected.to respond_to(:users) }

      it { expect(Bookmark.users).to include(user_bookmarked) }
      it { expect(Bookmark.users).not_to include(article_bookmarked, tag_bookmarked) }
    end

    describe '::articles' do
      it { is_expected.to respond_to(:articles) }

      it { expect(Bookmark.articles).to include(article_bookmarked) }
      it { expect(Bookmark.articles).not_to include(user_bookmarked, tag_bookmarked) }
    end

    describe '::tags' do
      it { is_expected.to respond_to(:tags) }

      it { expect(Bookmark.tags).to include(tag_bookmarked) }
      it { expect(Bookmark.tags).not_to include(user_bookmarked, article_bookmarked) }
    end
  end

  context 'Instance Methods' do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }

    let(:topic) { create(:topic, user: user) }
    let(:other_topic) { create(:topic, user: other_user) }

    let(:article) { create(:article, user: user, topic: topic) }
    let(:other_article) { create(:article, user: other_user, topic: other_topic) }

    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@bookmark.user?(@user)).to be true }
      it { expect(@bookmark.user?(create(:user))).to be false }
    end

    describe '.add' do
      it { is_expected.to respond_to(:add) }

      it 'adds a bookmark' do
        bookmark       = Bookmark.new
        bookmark_added = bookmark.add(user, 'Article', article.id, @topic.id)

        expect(bookmark).to be_valid
        expect(bookmark_added).to be true
      end

      it 'rejects unknown model' do
        bookmark       = Bookmark.new
        bookmark_added = bookmark.add(user, 'Unknown', article.id, @topic.id)

        expect(bookmark_added).to be false
        expect(bookmark.errors[:base].first).to eq(I18n.t('activerecord.errors.models.bookmark.model_unknown'))
      end

      it 'rejects already bookmarked' do
        Bookmark.new.add(user, 'Article', article.id, @topic.id)

        bookmark       = Bookmark.new
        bookmark_added = bookmark.add(user, 'Article', article.id, @topic.id)
        expect(bookmark_added).to be false
        expect(bookmark.errors[:base].first).to eq(I18n.t('activerecord.errors.models.bookmark.already_bookmarked'))
      end
    end

    describe '.remove' do
      it { is_expected.to respond_to(:remove) }

      it 'removes a bookmark' do
        bookmark = Bookmark.new
        bookmark.add(user, 'Article', article.id, @topic.id)
        bookmark_removed = bookmark.remove(user, 'Article', article.id)

        expect(bookmark_removed).to be true
      end

      it 'rejects unknown model' do
        bookmark = Bookmark.new
        bookmark.add(user, 'Article', article.id, @topic.id)
        bookmark_removed = bookmark.remove(user, 'Unknown', article.id)

        expect(bookmark_removed).to be false
        expect(bookmark.errors[:base].first).to eq(I18n.t('activerecord.errors.models.bookmark.model_unknown'))
      end

      it 'rejects already unbookmarked' do
        bookmark = Bookmark.new
        bookmark.add(user, 'Article', article.id, @topic.id)
        bookmark.remove(user, 'Article', article.id)
        bookmark_removed = bookmark.remove(user, 'Article', article.id)

        expect(bookmark_removed).to be false
        expect(bookmark.errors[:bookmark].first).to eq(I18n.t('activerecord.errors.models.bookmark.not_bookmarked'))
      end
    end
  end

end
