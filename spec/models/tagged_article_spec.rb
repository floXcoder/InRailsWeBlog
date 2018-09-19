# frozen_string_literal: true

# == Schema Information
#
# Table name: tagged_articles
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  topic_id   :integer          not null
#  tag_id     :integer          not null
#  article_id :integer          not null
#  parent     :boolean          default(FALSE), not null
#  child      :boolean          default(FALSE), not null
#  deleted_at :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe TaggedArticle, type: :model, basic: true do

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

  context 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Attributes' do
    it { is_expected.to respond_to(:parent) }
    it { is_expected.to respond_to(:child) }

    describe 'Default Attributes' do
      it { expect(@tagged_article.parent).to be false }
      it { expect(@tagged_article.child).to be false }
    end
  end

  context 'Associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:topic) }

    it { is_expected.to belong_to(:article) }

    it { is_expected.to belong_to(:tag) }

    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to validate_presence_of(:topic) }

    it { is_expected.to validate_presence_of(:article) }
    it { is_expected.to validate_presence_of(:tag) }

    it { is_expected.to validate_uniqueness_of(:article_id).scoped_to(:tag_id).with_message(I18n.t('activerecord.errors.models.tagged_article.already_tagged')) }

    describe 'private tag from another topic' do
      before do
        @second_topic = create(:topic, user: @user)
        @private_tag  = create(:tag, user: @user, visibility: 'only_me')

        other_user   = create(:user)
        @other_tag   = create(:tag, user: other_user, visibility: 'only_me')
      end

      it 'returns an error if topic does not own by same user than article' do
        # Useful?
        # tagged_article = build(:tagged_article, user: @user, tag: @private_tag, topic: @second_topic, article: @article)
        # expect(tagged_article.save).to be false
        # expect(tagged_article.errors[:base].first).to eq(I18n.t('activerecord.errors.models.tagged_article.tag_not_authorized'))

        tagged_article = build(:tagged_article, user: @user, tag: @other_tag, topic: @topic, article: @article)
        expect(tagged_article.save).to be false
        expect(tagged_article.errors[:base].first).to eq(I18n.t('activerecord.errors.models.tagged_article.incorrect_tag_affiliation'))
      end
    end
  end

  context 'Properties' do
    it { is_expected.to have_activity }

    it { is_expected.to act_as_paranoid(TaggedArticle) }
  end

end
