# == Schema Information
#
# Table name: votes
#
#  id            :integer          not null, primary key
#  voteable_type :string           not null
#  voteable_id   :integer          not null
#  voter_type    :string
#  voter_id      :integer
#  vote          :boolean          default(FALSE), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

RSpec.describe Vote, type: :model do

  before(:all) do
    @user     = create(:user)
    @voteable = create(:article, user: @user, topic: create(:topic, user: @user))
  end

  before do
    @vote = Vote.create(
      voter:    @user,
      voteable: @voteable
    )
  end

  subject { @vote }

  context 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Properties', basic: true do
    it { is_expected.to have_activity }
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:voter) }
    it { is_expected.to belong_to(:voteable) }

    it { is_expected.to validate_presence_of(:voter) }
    it { is_expected.to validate_presence_of(:voteable) }

    # it { is_expected.to validate_uniqueness_of(:voteable_id).scoped_to([:voteable_type, :voter_type, :voter_id]) }
  end

  context 'Public Methods', basic: true do
    subject { Vote }

    let(:other_user) { create(:user) }

    before do
      @article_1 = create(:article, user: @user, topic: create(:topic, user: @user))
      @article_2 = create(:article, user: @user, topic: create(:topic, user: @user))

      @vote_user_1       = @user.vote_for(@article_1)
      @vote_other_user_1 = other_user.vote_for(@article_1)

      @vote_user_2       = @user.vote_against(@article_2)
      @vote_other_user_2 = other_user.vote_for(@article_2)
    end

    describe '::for_voter' do
      it { is_expected.to respond_to(:for_voter) }

      it { expect(Vote.for_voter(@user)).to include(@vote_user_1, @vote_user_2) }
      it { expect(Vote.for_voter(@user)).not_to include(@vote_other_user_1, @vote_other_user_2) }
    end

    describe '::for_voteable' do
      it { is_expected.to respond_to(:for_voteable) }

      it { expect(Vote.for_voteable(@article_1)).to include(@vote_user_1) }
      it { expect(Vote.for_voteable(@article_1)).not_to include(@vote_user_2) }
    end

    describe '::descending' do
      it { is_expected.to respond_to(:descending) }

      it { expect(Vote.descending).to eq([@vote_other_user_2, @vote_user_2, @vote_other_user_1, @vote_user_1, @vote]) }
    end
  end

end
