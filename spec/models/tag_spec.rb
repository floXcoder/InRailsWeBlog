# == Schema Information
#
# Table name: tags
#
#  id                    :integer          not null, primary key
#  user_id             :integer          not null
#  name                  :string           not null
#  description           :text
#  synonyms              :string           default([]), is an Array
#  color                 :string
#  priority              :integer          default(0), not null
#  visibility            :integer          default(0), not null
#  archived              :boolean          default(FALSE), not null
#  accepted              :boolean          default(TRUE), not null
#  tagged_articles_count :integer          default(0)
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
      user:                @user,
      name:                  'Tag',
      description:           'Tag description',
      synonyms:              ['tagged'],
      color:                 'black',
      priority:              1,
      visibility:            'everyone',
      archived:              false,
      accepted:              true,
      tagged_articles_count: 0
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
    it { expect(@tag.visibility).to eq('everyone') }
    it { expect(@tag.archived).to be false }
    it { expect(@tag.accepted).to be false }
    it { expect(@tag.outdated_articles_count).to eq(0) }

    describe 'Default Attributes', basic: true do
      before do
        @tag = Tag.create(
          user:                @user,
          name:                  'Tag'
        )
      end

      it { expect(@tag.synonyms).to eq([]) }
      it { expect(@tag.priority).to eq(0) }
      it { expect(@tag.visibility).to eq('everyone') }
      it { expect(@tag.archived).to be false }
      it { expect(@tag.accepted).to be false }
      it { expect(@tag.outdated_articles_count).to eq(0) }
    end

    describe '#name' do
      it { is_expected.to validate_length_of(:name).is_at_least(CONFIG.tag_name_min_length) }
      it { is_expected.to validate_length_of(:name).is_at_most(CONFIG.tag_name_max_length) }
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

    it { is_expected.to have_strip_attributes([:name]) }

    it { is_expected.to have_paper_trail(Tag) }

    it { is_expected.to have_searh(Tag) }
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to have_db_index(:user_id) }

    it { is_expected.to have_many(:tagged_topics) }
    it { is_expected.to have_many(:topics) }

    it { is_expected.to have_many(:tagged_articles) }
    it { is_expected.to have_many(:articles) }

    it { is_expected.to have_many(:tag_relationships) }

    it { is_expected.to have_many(:parent_relationship) }
    it { is_expected.to have_many(:children) }

    it { is_expected.to have_many(:child_relationship) }
    it { is_expected.to have_many(:parents) }

    it { is_expected.to have_one(:pictures) }
    it { is_expected.to accept_nested_attributes_for(:pictures) }
  end

  context 'Public Methods', basic: true do
    subject { Tag }

    let!(:private_tag) { create(:tag, user: @user, visibility: 'only_me') }

    let!(:other_user) { create(:user) }
    let!(:other_tag) { create(:tag, user: other_user) }

    describe '::for_user_topic' do
      it { is_expected.to respond_to(:for_user_topic) }
    end

    describe '::everyone_and_user' do
      it { is_expected.to respond_to(:everyone_and_user) }
    end

    describe '::everyone_and_user_and_topic' do
      it { is_expected.to respond_to(:everyone_and_user_and_topic) }
    end

    describe '::most_used' do
      it { is_expected.to respond_to(:most_used) }
    end

    describe '::least_used' do
      it { is_expected.to respond_to(:least_used) }
    end

    # describe '::with_visibility' do
    #   it { is_expected.to respond_to(:with_visibility) }
    #   it { expect(Shop.with_visibility('only_me')).to include(private_shop) }
    #   it { expect(Shop.with_visibility(1)).to include(private_shop) }
    #   it { expect(Shop.with_visibility(1)).not_to include(@shop) }
    # end
    #
    # describe '::everyone_and_user' do
    #   it { is_expected.to respond_to(:everyone_and_user) }
    #   it { expect(Shop.everyone_and_user).to include(@shop, shop_from_other_user) }
    #   it { expect(Shop.everyone_and_user(@user.id)).to include(@shop, private_shop, shop_from_other_user) }
    # end
    #
    # describe '::from_user' do
    #   it { is_expected.to respond_to(:from_user) }
    #   it { expect(Shop.from_user).to match_array([]) }
    #   it { expect(Shop.from_user(@user.id)).to match_array([@shop]) }
    #   it { expect(Shop.from_user(@user.id, @user.id)).to match_array([@shop, private_shop]) }
    # end

    describe '::search_for' do
      it { is_expected.to respond_to(:search_for) }
    end

    describe '::autocomplete_for' do
      it { is_expected.to respond_to(:autocomplete_for) }
    end

    describe '::parse_tags' do
      it { is_expected.to respond_to(:parse_tags) }
    end

    describe '::remove_unused_tags' do
      it { is_expected.to respond_to(:remove_unused_tags) }
    end

    # describe '::as_json' do
    #   it { is_expected.to respond_to(:as_json) }
    #   it { expect(Shop.as_json(@shop)).to be_a(Hash) }
    #   it { expect(Shop.as_json(@shop)[:shop]).to be_a(Hash) }
    #   it { expect(Shop.as_json([@shop])).to be_a(Hash) }
    #   it { expect(Shop.as_json([@shop])[:shops]).to be_a(Array) }
    # end
    #
    # describe '::as_flat_json' do
    #   it { is_expected.to respond_to(:as_flat_json) }
    #   it { expect(Shop.as_flat_json(@shop)).to be_a(Hash) }
    #   it { expect(Shop.as_flat_json([@shop])).to be_a(Array) }
    # end
  end

  context 'Instance Methods', basic: true do
    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@tag.user?(@user)).to be true }
      it { expect(@tag.user?(create(:user))).to be false }
    end

  end

end
