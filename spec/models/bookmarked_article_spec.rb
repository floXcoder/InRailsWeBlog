RSpec.describe Bookmark, type: :model do

  before(:all) do
    @user       = create(:user)
    @bookmarked = create(:article, user: @user, topic: create(:topic, user: @user))
  end

  before do
    @bookmark = Bookmark.create(
      user:       @user,
      bookmarked: @bookmarked
    )
  end

  subject { @bookmark }

  context 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:bookmarked) }

    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to validate_presence_of(:bookmarked_id) }
    it { is_expected.to validate_presence_of(:bookmarked_type) }

    it { is_expected.to validate_uniqueness_of(:user_id).scoped_to([:bookmarked_id, :bookmarked_type]) }
  end

  # context 'Public Methods', basic: true do
  #   subject { Bookmark }
  #
  #   let(:user) { create(:user) }
  #   let(:topic) { create(:topic, user: user) }
  #
  #   let(:article) { create(:article, user: user, topic: topic) }
  #   let(:tag) { create(:product, user: user) }
  #
  #   before do
  #     create(:bookmark, user: user, bookmarked: article)
  #     create(:bookmark, user: user, bookmarked: user)
  #     create(:bookmark, user: user, bookmarked: tag)
  #   end
  # end

end
