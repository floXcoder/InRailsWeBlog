# == Schema Information
#
# Table name: tag_relationships
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  topic_id   :integer          not null
#  article_id :integer          not null
#  parent_id  :integer          not null
#  child_id   :integer          not null
#  deleted_at :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe TagRelationship, type: :model, basic: true do

  before(:all) do
    @user    = create(:user)
    @topic   = create(:topic, user: @user)
    @article = create(:article, user: @user, topic: @topic)

    @parent_tag = create(:tag, user: @user)
    @child_tag  = create(:tag, user: @user)
  end

  before do
    @tag_relation = TagRelationship.create(
      user:    @user,
      topic:   @topic,
      parent:  @parent_tag,
      child:   @child_tag,
      article: @article
    )
  end

  subject { @tag_relation }

  context 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:topic) }

    it { is_expected.to belong_to(:article) }

    it { is_expected.to belong_to(:parent) }
    it { is_expected.to belong_to(:child) }

    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to validate_presence_of(:topic) }

    it { is_expected.to validate_presence_of(:article) }

    it { is_expected.to validate_presence_of(:parent) }
    it { is_expected.to validate_presence_of(:child) }

    it { is_expected.to validate_uniqueness_of(:parent_id).scoped_to([:article_id, :child_id]).with_message(I18n.t('activerecord.errors.models.tag_relationship.already_linked')) }
  end

  context 'Properties' do
    it { is_expected.to act_as_paranoid(TagRelationship) }
  end

end
