# == Schema Information
#
# Table name: tags
#
#  id                    :integer          not null, primary key
#  user_id               :integer
#  name                  :string           not null
#  description           :text
#  synonyms              :string           default([]), is an Array
#  color                 :string
#  priority              :integer          default(0), not null
#  visibility            :integer          default("everyone"), not null
#  accepted              :boolean          default(TRUE), not null
#  archived              :boolean          default(FALSE), not null
#  pictures_count        :integer          default(0)
#  tagged_articles_count :integer          default(0)
#  bookmarks_count       :integer          default(0)
#  slug                  :string
#  deleted_at            :datetime
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

RSpec.describe Tag, type: :model do

  before(:all) do
    @user = create(:user)
  end

  before do
    @tag = Tag.create(
      user:        @user,
      name:        'Tag',
      description: 'Tag description',
      synonyms:    ['tagged'],
      color:       'black',
      priority:    1,
      visibility:  'only_me',
      archived:    false,
      accepted:    true
    )
  end

  subject { @tag }

  describe 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Attributes', basic: true do
    it { is_expected.to respond_to(:name) }
    it { is_expected.to respond_to(:description) }
    it { is_expected.to respond_to(:synonyms) }
    it { is_expected.to respond_to(:color) }
    it { is_expected.to respond_to(:priority) }
    it { is_expected.to respond_to(:visibility) }
    it { is_expected.to respond_to(:archived) }
    it { is_expected.to respond_to(:accepted) }
    it { is_expected.to respond_to(:tagged_articles_count) }

    it { expect(@tag.name).to eq('Tag') }
    it { expect(@tag.description).to eq('Tag description') }
    it { expect(@tag.synonyms).to eq(['tagged']) }
    it { expect(@tag.color).to eq('black') }
    it { expect(@tag.priority).to eq(1) }
    it { expect(@tag.visibility).to eq('only_me') }
    it { expect(@tag.archived).to be false }
    it { expect(@tag.accepted).to be true }
    it { expect(@tag.pictures_count).to eq(0) }
    it { expect(@tag.tagged_articles_count).to eq(0) }
    it { expect(@tag.bookmarks_count).to eq(0) }

    describe 'Default Attributes', basic: true do
      before do
        @tag = Tag.create(
          user: @user,
          name: 'Tag'
        )
      end

      it { expect(@tag.synonyms).to eq([]) }
      it { expect(@tag.priority).to eq(0) }
      it { expect(@tag.visibility).to eq('everyone') }
      it { expect(@tag.archived).to be false }
      it { expect(@tag.accepted).to be true }
      it { expect(@tag.pictures_count).to eq(0) }
      it { expect(@tag.tagged_articles_count).to eq(0) }
      it { expect(@tag.bookmarks_count).to eq(0) }
    end

    describe '#name' do
      it { is_expected.to validate_length_of(:name).is_at_least(CONFIG.tag_name_min_length) }
      it { is_expected.to validate_length_of(:name).is_at_most(CONFIG.tag_name_max_length) }

      it 'can change name if private' do
        tag_private       = Tag.create(user: @user, name: 'tag 1', visibility: 'only_me')
        other_tag_private = Tag.create(user: @user, name: 'tag 2', visibility: 'only_me')
        tag_public        = Tag.create(user: @user, name: 'tag 3', visibility: 'everyone')

        tag_private.name = 'tag 1.1'
        expect(tag_private.save).to be true

        tag_private.name = other_tag_private.name
        expect(tag_private.save).to be false
        expect(tag_private.errors[:name].first).to eq(I18n.t('activerecord.errors.models.tag.already_exist'))

        tag_private.name = tag_public.name
        expect(tag_private.save).to be false
        expect(tag_private.errors[:name].first).to eq(I18n.t('activerecord.errors.models.tag.already_exist_in_public'))
      end

      it 'cannot change name if public' do
        tag_public = Tag.create(user: @user, name: 'tag 1', visibility: 'everyone')

        tag_public.name = 'tag 2'
        expect(tag_public.save).to be false
        expect(tag_public.errors[:name].first).to eq(I18n.t('activerecord.errors.models.tag.public_name_immutable'))
      end
    end

    describe '#description' do
      it { is_expected.to validate_length_of(:description).is_at_least(CONFIG.tag_description_min_length) }
      it { is_expected.to validate_length_of(:description).is_at_most(CONFIG.tag_description_max_length) }
    end

    describe '#visibility' do
      it { is_expected.to have_enum(:visibility) }
      it { is_expected.to validate_presence_of(:visibility) }
    end
  end

  context 'Properties', basic: true do
    it { is_expected.to have_friendly_id(:slug) }

    it { is_expected.to act_as_tracked(Tag) }

    it { is_expected.to have_activity }

    it { is_expected.to have_strip_attributes([:name, :color]) }

    it { is_expected.to have_paper_trail(Tag) }

    it { is_expected.to have_search(Tag) }

    it { is_expected.to act_as_paranoid(Tag) }

    it 'uses counter cache for picture' do
      picture      = create(:picture, user: @user, imageable_type: 'Tag')
      expect {
        @tag.picture = picture
        @tag.reload
      }.to change(@tag, :pictures_count).by(1)
    end

    it 'uses counter cache for outdated articles' do
      outdated_article = create(:tagged_article, tag: @tag, article: create(:article, user: @user, topic: create(:topic, user: @user)))
      expect {
        @tag.tagged_articles << outdated_article
      }.to change(@tag.reload, :tagged_articles_count).by(1)
    end

    it 'uses counter cache for bookmarks' do
      bookmark = create(:bookmark, user: @user, bookmarked: @tag)
      expect {
        @tag.bookmarks << bookmark
      }.to change(@tag.reload, :bookmarks_count).by(1)
    end
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to validate_presence_of(:user) }

    it { is_expected.to have_many(:tagged_topics) }
    it { is_expected.to have_many(:topics) }

    it { is_expected.to have_many(:tagged_articles) }
    it { is_expected.to have_many(:articles) }

    it { is_expected.to have_many(:parent_relationship) }
    it { is_expected.to have_many(:children) }

    it { is_expected.to have_many(:child_relationship) }
    it { is_expected.to have_many(:parents) }

    it { is_expected.to have_one(:picture) }
    it { is_expected.to accept_nested_attributes_for(:picture) }

    it { is_expected.to have_many(:bookmarks) }
    it { is_expected.to have_many(:user_bookmarks) }
    it { is_expected.to have_many(:follower) }
  end

  context 'Public Methods', basic: true do
    subject { Tag }

    let!(:private_tag) { create(:tag, user: @user, visibility: 'only_me', tagged_articles_count: 0) }

    let!(:other_user) { create(:user) }
    let!(:other_tag) { create(:tag, user: other_user, tagged_articles_count: 20) }

    let!(:topic) { create(:topic, user: @user) }

    before do
      @tag.topics << topic

      @tag.bookmarks << create(:bookmark, user: @user, bookmarked: @tag)

      Tag.reindex
      Tag.search_index.refresh
    end

    describe '::everyone_and_user' do
      it { is_expected.to respond_to(:everyone_and_user) }
      it { expect(Tag.everyone_and_user).to include(other_tag) }
      it { expect(Tag.everyone_and_user).not_to include(@tag, private_tag) }
      it { expect(Tag.everyone_and_user(@user.id)).to include(@tag, private_tag, other_tag) }
    end

    describe '::everyone_and_user_and_topic' do
      it { is_expected.to respond_to(:everyone_and_user_and_topic) }
      it { expect(Tag.everyone_and_user_and_topic(@user.id, topic.id)).to include(@tag) }
      it { expect(Tag.everyone_and_user_and_topic(@user.id, topic.id)).not_to include(other_tag, private_tag) }
    end

    describe '::with_visibility' do
      it { is_expected.to respond_to(:with_visibility) }
      it { expect(Tag.with_visibility('only_me')).to include(private_tag) }
      it { expect(Tag.with_visibility('only_me')).not_to include(other_tag) }
      it { expect(Tag.with_visibility(1)).to include(private_tag) }
      it { expect(Tag.with_visibility(1)).not_to include(other_tag) }
    end

    describe '::from_user' do
      it { is_expected.to respond_to(:from_user) }
      it { expect(Tag.from_user(@user.id)).to be_empty }
      it { expect(Tag.from_user(@user.id, @user.id)).to include(@tag, private_tag) }
      it { expect(Tag.from_user(@user.id, @user.id)).not_to include(other_tag) }
    end

    describe '::for_user_topic' do
      it { is_expected.to respond_to(:for_user_topic) }
      it { expect(Tag.for_user_topic(@user.id, topic.id)).to include(@tag) }
      it { expect(Tag.for_user_topic(@user.id, topic.id)).not_to include(private_tag, other_tag) }
    end

    describe '::most_used' do
      it { is_expected.to respond_to(:most_used) }
      it { expect(Tag.most_used.first).to eq(other_tag) }
    end

    describe '::least_used' do
      it { is_expected.to respond_to(:least_used) }
      it { expect(Tag.least_used.first).not_to eq(other_tag) }
    end

    describe '::unused' do
      before do
        private_tag.update_attributes(updated_at: 3.days.ago)
      end

      it { is_expected.to respond_to(:unused) }
      it { expect(Tag.unused).to eq([private_tag]) }
    end

    describe '::bookmarked_by_user' do
      it { is_expected.to respond_to(:bookmarked_by_user) }
      it { expect(Tag.bookmarked_by_user(@user)).to include(@tag) }
      it { expect(Tag.bookmarked_by_user(@user)).not_to include(other_tag) }
    end

    describe '::search_for' do
      it { is_expected.to respond_to(:search_for) }

      it 'search for tags' do
        tag_results = Tag.search_for('tag')
        expect(tag_results[:tags]).not_to be_empty
        expect(tag_results[:tags]).to be_a(Array)
        expect(tag_results[:tags].size).to eq(3)
        expect(tag_results[:tags].map { |tag| tag[:name] }).to include(@tag.name, other_tag.name)
      end
    end

    describe '::autocomplete_for' do
      it { is_expected.to respond_to(:autocomplete_for) }

      it 'autocompletes for tags' do
        tag_autocompletes = Tag.autocomplete_for('ta')

        expect(tag_autocompletes).not_to be_empty
        expect(tag_autocompletes).to be_a(Array)
        expect(tag_autocompletes.size).to eq(3)
        expect(tag_autocompletes.map { |tag| tag[:name] }).to include(@tag.name, other_tag.name)
      end
    end

    describe '::order_by' do
      it { is_expected.to respond_to(:order_by) }
      it { expect(Tag.order_by('id_first')).to be_kind_of(ActiveRecord::Relation) }
    end

    describe '::parse_tags' do
      it { is_expected.to respond_to(:parse_tags) }
      it { expect(Tag.parse_tags(["only_me,#{@tag.name}"], @user.id)).to eq([@tag]) }
      it { expect(Tag.parse_tags(['everyone,new tag'], @user.id).first).to be_a(Tag) }
    end

    describe '::remove_unused_tags' do
      it { is_expected.to respond_to(:remove_unused_tags) }
      it { expect { Tag.remove_unused_tags([private_tag]) }.to change(Tag, :count).by(-1) }
    end

    describe '::as_json' do
      it { is_expected.to respond_to(:as_json) }
      it { expect(Tag.as_json(@tag)).to be_a(Hash) }
      it { expect(Tag.as_json(@tag)[:tag]).to be_a(Hash) }
      it { expect(Tag.as_json([@tag])).to be_a(Hash) }
      it { expect(Tag.as_json([@tag])[:tags]).to be_a(Array) }
    end

    describe '::as_flat_json' do
      it { is_expected.to respond_to(:as_flat_json) }
      it { expect(Tag.as_flat_json(@tag)).to be_a(Hash) }
      it { expect(Tag.as_flat_json([@tag])).to be_a(Array) }
    end
  end

  context 'Instance Methods', basic: true do
    let!(:other_user) { create(:user) }

    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@tag.user?(@user)).to be true }
      it { expect(@tag.user?(other_user)).to be false }
    end

    describe '.format_attributes' do
      it { is_expected.to respond_to(:format_attributes) }
    end

    describe '.default_picture' do
      it { is_expected.to respond_to(:default_picture) }
      it { expect(@tag.default_picture).to eq('/assets/') }
    end

    describe '.bookmarked?' do
      before do
        create(:bookmark, user: other_user, bookmarked: @tag, follow: true)
      end

      it { is_expected.to respond_to(:bookmarked?) }
      it { expect(@tag.bookmarked?(other_user)).to be true }
      it { expect(@tag.bookmarked?(@user)).to be false }
    end

    describe '.followed?' do
      before do
        create(:bookmark, user: other_user, bookmarked: @tag)
      end

      it { is_expected.to respond_to(:followed?) }
      it { expect(@tag.followed?(other_user)).to be true }
      it { expect(@tag.followed?(@user)).to be false }
    end

    describe '.slug_candidates' do
      it { is_expected.to respond_to(:slug_candidates) }
      it { expect(@tag.slug_candidates).to be_a Array }
    end

    describe '.search_data' do
      it { is_expected.to respond_to(:search_data) }
      it { expect(@tag.search_data).to be_a Hash }
    end
  end

end
