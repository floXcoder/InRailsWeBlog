# == Schema Information
#
# Table name: tagged_topics
#
#  id         :integer          not null, primary key
#  topic_id   :integer          not null
#  user_id    :integer          not null
#  tag_id     :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

RSpec.describe TaggedTopic, type: :model do

  before(:all) do
    @user = create(:user)

    @topic = create(:topic, user: @user)
    @tag   = create(:tag, user: @user)
  end

  before do
    @tagged_topic = TaggedTopic.create(
      topic: @topic,
      user:  @user,
      tag:   @tag
    )
  end

  subject { @tagged_topic }

  context 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:topic) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:tag) }

    it { is_expected.to validate_presence_of(:topic) }
    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to validate_presence_of(:tag) }

    it { is_expected.to validate_uniqueness_of(:user_id).scoped_to([:tag_id, :topic_id]) }
  end

end
