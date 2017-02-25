# == Schema Information
#
# Table name: tag_relationships
#
#  id          :integer          not null, primary key
#  parent_id   :integer          not null
#  child_id    :integer          not null
#  article_ids :string           not null, is an Array
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

RSpec.describe TagRelationship, type: :model do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @parent_tag = create(:tag, tagger: @user)
    @child_tag  = create(:tag, tagger: @user)
  end

  before do
    @tag_relation = TagRelationship.create(
      parent: @parent_tag,
      child:  @child_tag
    )
  end

  subject { @tag_relation }

  context 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:parent) }
    it { is_expected.to belong_to(:child) }

    it { is_expected.to validate_presence_of(:parent) }
    it { is_expected.to validate_presence_of(:child) }

    it { is_expected.to validate_uniqueness_of(:parent_id).scoped_to(:child_id) }
  end

end
