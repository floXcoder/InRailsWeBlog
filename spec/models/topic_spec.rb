# == Schema Information
#
# Table name: topics
#
#  id              :integer          not null, primary key
#  user_id         :integer
#  name            :string           not null
#  description     :text
#  color           :string
#  priority        :integer          default(0), not null
#  visibility      :integer          default("everyone"), not null
#  accepted        :boolean          default(TRUE), not null
#  archived        :boolean          default(FALSE), not null
#  pictures_count  :integer          default(0)
#  articles_count  :integer          default(0)
#  bookmarks_count :integer          default(0)
#  slug            :string
#  deleted_at      :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
require 'rails_helper'

RSpec.describe Topic, type: :model do

  before(:all) do
    @user = create(:user)
  end

  before do
    @topic = Topic.create(
      user:        @user,
      name:        'Topic',
      description: 'Topic description',
      color:       'black',
      priority:    1,
      visibility:  'everyone',
      archived:    false,
      accepted:    true
    )
  end

  subject { @topic }

  describe 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Attributes', basic: true do
    it { is_expected.to respond_to(:name) }
    it { is_expected.to respond_to(:description) }
    it { is_expected.to respond_to(:color) }
    it { is_expected.to respond_to(:priority) }
    it { is_expected.to respond_to(:visibility) }
    it { is_expected.to respond_to(:archived) }
    it { is_expected.to respond_to(:accepted) }
    it { is_expected.to respond_to(:pictures_count) }
    it { is_expected.to respond_to(:articles_count) }
    it { is_expected.to respond_to(:bookmarks_count) }

    it { expect(@topic.name).to eq('Topic') }
    it { expect(@topic.description).to eq('Topic description') }
    it { expect(@topic.color).to eq('black') }
    it { expect(@topic.priority).to eq(1) }
    it { expect(@topic.visibility).to eq('everyone') }
    it { expect(@topic.archived).to be false }
    it { expect(@topic.accepted).to be true }
    it { expect(@topic.pictures_count).to eq(0) }
    it { expect(@topic.articles_count).to eq(0) }
    it { expect(@topic.bookmarks_count).to eq(0) }

    describe 'Default Attributes', basic: true do
      before do
        @topic = Topic.create(
          user: @user,
          name: 'Topic'
        )
      end

      it { expect(@topic.priority).to eq(0) }
      it { expect(@topic.visibility).to eq('everyone') }
      it { expect(@topic.archived).to be false }
      it { expect(@topic.accepted).to be true }
      it { expect(@topic.pictures_count).to eq(0) }
      it { expect(@topic.articles_count).to eq(0) }
      it { expect(@topic.bookmarks_count).to eq(0) }
    end

    describe '#name' do
      it { is_expected.to validate_length_of(:name).is_at_least(CONFIG.topic_name_min_length) }
      it { is_expected.to validate_length_of(:name).is_at_most(CONFIG.topic_name_max_length) }
    end

    describe '#description' do
      it { is_expected.to validate_length_of(:description).is_at_least(CONFIG.topic_description_min_length) }
      it { is_expected.to validate_length_of(:description).is_at_most(CONFIG.topic_description_max_length) }
    end

    describe '#visibility' do
      it { is_expected.to have_enum(:visibility) }
      it { is_expected.to validate_presence_of(:visibility) }
    end
  end

  context 'Properties', basic: true do
    it { is_expected.to have_friendly_id(:slug) }

    it { is_expected.to have_activity }

    it { is_expected.to have_strip_attributes([:name, :color]) }

    it { is_expected.to have_paper_trail(Topic) }

    it { is_expected.to have_search(Topic) }

    it { is_expected.to act_as_paranoid(Topic) }

    it 'uses counter cache for picture' do
      picture = create(:picture, user: @user, imageable_type: 'Topic')
      expect {
        @topic.picture = picture
        @topic.reload
      }.to change(@topic, :pictures_count).by(1)
    end

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

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to have_db_index(:user_id) }

    it { is_expected.to have_many(:articles) }

    it { is_expected.to have_many(:tagged_articles) }
    it { is_expected.to have_many(:tag_relationships) }

    it { is_expected.to have_many(:bookmarks) }
    it { is_expected.to have_many(:user_bookmarks) }
    it { is_expected.to have_many(:follower) }

    it { is_expected.to have_one(:picture) }
    it { is_expected.to accept_nested_attributes_for(:picture) }
  end

  context 'Public Methods', basic: true do
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

    describe '::search_for' do
      it { is_expected.to respond_to(:search_for) }

      it 'search for topics' do
        topic_results = Topic.search_for('topic')
        expect(topic_results[:topics]).not_to be_empty
        expect(topic_results[:topics]).to be_a(Array)
        expect(topic_results[:topics].size).to eq(3)
        expect(topic_results[:topics].map { |topic| topic[:name] }).to include(@topic.name, other_topic.name)
      end
    end

    describe '::autocomplete_for' do
      it { is_expected.to respond_to(:autocomplete_for) }

      it 'autocompletes for topics' do
        topic_autocompletes = Topic.autocomplete_for('top')

        expect(topic_autocompletes).not_to be_empty
        expect(topic_autocompletes).to be_a(Array)
        expect(topic_autocompletes.size).to eq(3)
        expect(topic_autocompletes.map { |topic| topic[:name] }).to include(@topic.name, other_topic.name)
      end
    end

    describe '::default_visibility' do
      it { is_expected.to respond_to(:default_visibility) }
      it { expect(Topic.default_visibility).to be_kind_of(ActiveRecord::Relation) }
    end

    describe '::filter_by' do
      it { is_expected.to respond_to(:filter_by) }
      it { expect(Topic.filter_by(Topic.all, {accepted: true})).to include(@topic) }
    end

    describe '::order_by' do
      it { is_expected.to respond_to(:order_by) }
      it { expect(Topic.order_by('id_first')).to be_kind_of(ActiveRecord::Relation) }
    end
  end

  context 'Instance Methods', basic: true do
    let!(:other_user) { create(:user) }

    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@topic.user?(@user)).to be true }
      it { expect(@topic.user?(create(:user))).to be false }
    end

    describe '.format_attributes' do
      it { is_expected.to respond_to(:format_attributes) }
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
