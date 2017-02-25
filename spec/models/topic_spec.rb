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
    it { is_expected.to respond_to(:topicged_articles_count) }

    it { expect(@topic.name).to eq('Topic') }
    it { expect(@topic.description).to eq('Topic description') }
    it { expect(@topic.color).to eq('black') }
    it { expect(@topic.priority).to eq(1) }
    it { expect(@topic.visibility).to eq('everyone') }
    it { expect(@topic.archived).to be false }
    it { expect(@topic.accepted).to be false }
    it { expect(@topic.outdated_articles_count).to eq(0) }

    describe 'Default Attributes', basic: true do
      before do
        @topic = Topic.create(
          topic: @user,
          name:     'Topic'
        )
      end

      it { expect(@topic.priority).to eq(0) }
      it { expect(@topic.visibility).to eq('everyone') }
      it { expect(@topic.archived).to be false }
      it { expect(@topic.accepted).to be false }
      it { expect(@topic.outdated_articles_count).to eq(0) }
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

    # it { is_expected.to act_as_tracked(Topic) }

    it { is_expected.to have_activity }

    it { is_expected.to have_strip_attributes([:name]) }

    it { is_expected.to have_paper_trail(Topic) }

    it { is_expected.to have_searh(Topic) }
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to have_db_index(:user_id) }

    # it { is_expected.to have_many(:tags) }

    # it { is_expected.to have_many(:articles) }

    it { is_expected.to have_one(:pictures) }
    it { is_expected.to accept_nested_attributes_for(:pictures) }
  end

  context 'Public Methods', basic: true do
    subject { Topic }

    let!(:private_topic) { create(:topic, user: @user, visibility: 'only_me') }

    let!(:other_user) { create(:user) }
    let!(:other_topic) { create(:topic, user: other_user) }

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
      it { expect(@topic.user?(@user)).to be true }
      it { expect(@topic.user?(create(:user))).to be false }
    end

    describe '.format_attributes' do
      it { is_expected.to respond_to(:format_attributes) }
    end
  end

end
