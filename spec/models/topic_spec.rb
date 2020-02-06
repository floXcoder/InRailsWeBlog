# frozen_string_literal: true

# == Schema Information
#
# Table name: topics
#
#  id                       :bigint           not null, primary key
#  user_id                  :bigint
#  name                     :string           not null
#  description_translations :jsonb
#  languages                :string           default([]), is an Array
#  color                    :string
#  priority                 :integer          default(0), not null
#  visibility               :integer          default("everyone"), not null
#  accepted                 :boolean          default(TRUE), not null
#  archived                 :boolean          default(FALSE), not null
#  pictures_count           :integer          default(0)
#  articles_count           :integer          default(0)
#  bookmarks_count          :integer          default(0)
#  slug                     :string
#  deleted_at               :datetime
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  settings                 :jsonb            not null
#  mode                     :integer          default("default"), not null
#
require 'rails_helper'

RSpec.describe Topic, type: :model, basic: true do

  before(:all) do
    @user = create(:user)
  end

  before do
    @topic = Topic.create(
      user:        @user,
      mode:        :default,
      name:        'Topic',
      description: 'Topic description',
      languages:   ['fr'],
      color:       '#000000',
      priority:    1,
      visibility:  :everyone,
      archived:    false,
      accepted:    true
    )
  end

  subject { @topic }

  describe 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Attributes' do
    it { is_expected.to respond_to(:name) }
    it { is_expected.to respond_to(:description) }
    it { is_expected.to respond_to(:mode) }
    it { is_expected.to respond_to(:languages) }
    it { is_expected.to respond_to(:color) }
    it { is_expected.to respond_to(:priority) }
    it { is_expected.to respond_to(:visibility) }
    it { is_expected.to respond_to(:archived) }
    it { is_expected.to respond_to(:accepted) }
    it { is_expected.to respond_to(:articles_count) }
    it { is_expected.to respond_to(:bookmarks_count) }

    it { expect(@topic.name).to eq('Topic') }
    it { expect(@topic.mode).to eq('default') }
    it { expect(@topic.description).to eq('Topic description') }
    it { expect(@topic.languages).to eq(['fr']) }
    it { expect(@topic.color).to eq('#000000') }
    it { expect(@topic.priority).to eq(1) }
    it { expect(@topic.visibility).to eq('everyone') }
    it { expect(@topic.archived).to be false }
    it { expect(@topic.accepted).to be true }
    it { expect(@topic.articles_count).to eq(0) }
    it { expect(@topic.bookmarks_count).to eq(0) }

    describe 'Default Attributes' do
      before do
        @topic = Topic.create(
          user: @user,
          name: 'Topic'
        )
      end

      it { expect(@topic.mode).to eq('default') }
      it { expect(@topic.priority).to eq(0) }
      it { expect(@topic.visibility).to eq('everyone') }
      it { expect(@topic.archived).to be false }
      it { expect(@topic.accepted).to be true }
      it { expect(@topic.articles_count).to eq(0) }
      it { expect(@topic.bookmarks_count).to eq(0) }
    end

    describe '#name' do
      it { is_expected.to validate_length_of(:name).is_at_least(InRailsWeBlog.config.topic_name_min_length) }
      it { is_expected.to validate_length_of(:name).is_at_most(InRailsWeBlog.config.topic_name_max_length) }
    end

    describe '#description' do
      it { is_expected.to validate_length_of(:description).is_at_least(InRailsWeBlog.config.topic_description_min_length) }
      it { is_expected.to validate_length_of(:description).is_at_most(InRailsWeBlog.config.topic_description_max_length) }
    end

    describe '#mode' do
      it { is_expected.to have_enum(:mode) }
      it { is_expected.to validate_presence_of(:mode) }
    end

    describe '#visibility' do
      it { is_expected.to have_enum(:visibility) }
      it { is_expected.to validate_presence_of(:visibility) }
    end

    describe '#color' do
      it 'set the default color' do
        topic = Topic.create(user: @user, name: 'default color')

        expect(topic.color).to eq('#e5e5e5')
      end
    end
  end

  context 'Associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to have_db_index(:user_id) }

    it { is_expected.to have_one(:icon) }
    it { is_expected.to accept_nested_attributes_for(:icon) }

    it { is_expected.to have_many(:inventory_fields) }
    it { is_expected.to accept_nested_attributes_for(:inventory_fields) }

    it { is_expected.to have_many(:articles) }

    it { is_expected.to have_many(:tagged_articles) }
    it { is_expected.to have_many(:tag_relationships) }
    it { is_expected.to have_many(:tags) }

    it { is_expected.to have_many(:bookmarks) }
    it { is_expected.to have_many(:user_bookmarks) }
    it { is_expected.to have_many(:follower) }

    it { is_expected.to have_many(:user_activities) }

    it { is_expected.to have_many(:shares) }
    it { is_expected.to have_many(:contributors) }
  end

  context 'Properties' do
    it { is_expected.to callback(:set_default_color).before(:create) }

    it { is_expected.to respond_to(:slug) }
    it { is_expected.to respond_to(:slug_candidates) }

    it { is_expected.to have_activity }

    it { is_expected.to have_strip_attributes([:name, :color]) }

    it { is_expected.to have_paper_trail(Topic) }

    it { is_expected.to have_search(Topic) }

    it { is_expected.to act_as_paranoid(Topic) }

    it 'uses counter cache for articles' do
      article = create(:article, user: @user, topic: @topic)
      expect {
        @topic.articles << article
      }.to change(@topic.reload, :articles_count).by(1)
    end

    it 'uses counter cache for bookmarks' do
      bookmark = create(:bookmark, user: @user, bookmarked: @topic)
      expect {
        @topic.bookmarks << bookmark
      }.to change(@topic.reload, :bookmarks_count).by(1)
    end
  end

  context 'Public Methods' do
    subject { Topic }

    let!(:private_topic) { create(:topic, user: @user, visibility: 'only_me') }

    let!(:other_user) { create(:user) }
    let!(:other_topic) { create(:topic, user: other_user) }

    before do
      @topic.bookmarks << create(:bookmark, user: @user, bookmarked: @topic)

      Topic.reindex
      Topic.search_index.refresh
    end

    describe '::everyone_and_user' do
      it { is_expected.to respond_to(:everyone_and_user) }
      it { expect(Topic.everyone_and_user).to include(@topic, other_topic) }
      it { expect(Topic.everyone_and_user).not_to include(private_topic) }
      it { expect(Topic.everyone_and_user(@user.id)).to include(@topic, private_topic, other_topic) }
    end

    describe '::with_visibility' do
      it { is_expected.to respond_to(:with_visibility) }
      it { expect(Topic.with_visibility('only_me')).to include(private_topic) }
      it { expect(Topic.with_visibility('only_me')).not_to include(other_topic) }
      it { expect(Topic.with_visibility(1)).to include(private_topic) }
      it { expect(Topic.with_visibility(1)).not_to include(other_topic) }
    end

    describe '::from_user' do
      it { is_expected.to respond_to(:from_user) }
      it { expect(Topic.from_user(@user.id)).to include(@topic) }
      it { expect(Topic.from_user(@user.id)).not_to include(other_topic) }
      it { expect(Topic.from_user(@user.id)).not_to include(private_topic) }
      it { expect(Topic.from_user(@user.id, @user.id)).to include(@topic, private_topic) }
      it { expect(Topic.from_user(@user.id, @user.id)).not_to include(other_topic) }
    end

    describe '::bookmarked_by_user' do
      it { is_expected.to respond_to(:bookmarked_by_user) }
      it { expect(Topic.bookmarked_by_user(@user)).to include(@topic) }
      it { expect(Topic.bookmarked_by_user(@user)).not_to include(other_topic) }
    end
  end

  context 'Instance Methods' do
    let!(:other_user) { create(:user) }

    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@topic.user?(@user)).to be true }
      it { expect(@topic.user?(create(:user))).to be false }
    end

    describe '.bookmarked?' do
      before do
        create(:bookmark, user: other_user, bookmarked: @topic, follow: true)
      end

      it { is_expected.to respond_to(:bookmarked?) }
      it { expect(@topic.bookmarked?(other_user)).to be true }
      it { expect(@topic.bookmarked?(@user)).to be false }
    end

    describe '.followed?' do
      before do
        create(:bookmark, user: other_user, bookmarked: @topic)
      end

      it { is_expected.to respond_to(:followed?) }
      it { expect(@topic.followed?(other_user)).to be true }
      it { expect(@topic.followed?(@user)).to be false }
    end

    describe '.slug_candidates' do
      it { is_expected.to respond_to(:slug_candidates) }
      it { expect(@topic.slug_candidates).to be_a(Array) }
    end

    describe '.search_data' do
      it { is_expected.to respond_to(:search_data) }
      it { expect(@topic.search_data).to be_a(Hash) }
    end
  end

end
