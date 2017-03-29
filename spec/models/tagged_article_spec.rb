# == Schema Information
#
# Table name: tagged_articles
#
#  id         :integer          not null, primary key
#  article_id :integer          not null
#  tag_id     :integer          not null
#  parent     :boolean          default(FALSE), not null
#  child      :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe TaggedArticle, type: :model do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)
    @tag     = create(:tag, user: @user)
  end

  before do
    @tagged_article = TaggedArticle.create(
      user:    @user,
      topic:   @topic,
      article: @article,
      tag:     @tag
    )
  end

  subject { @tagged_article }

  context 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Attributes', basic: true do
    it { is_expected.to respond_to(:parent) }
    it { is_expected.to respond_to(:child) }

    describe 'Default Attributes', basic: true do
      it { expect(@tagged_article.parent).to be false }
      it { expect(@tagged_article.child).to be false }
    end
  end

  context 'Properties', basic: true do
    it { is_expected.to have_activity }

    it { is_expected.to act_as_paranoid(TaggedArticle) }
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:topic) }

    it { is_expected.to belong_to(:article) }

    it { is_expected.to belong_to(:tag) }

    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to validate_presence_of(:topic) }

    it { is_expected.to validate_presence_of(:article).on(:update) }
    it { is_expected.to validate_presence_of(:tag).on(:update) }

    it { is_expected.to validate_uniqueness_of(:article_id).scoped_to(:tag_id).with_message(I18n.t('activerecord.errors.models.tagged_article.already_tagged')) }
  end

end
