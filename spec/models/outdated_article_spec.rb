# frozen_string_literal: true

# == Schema Information
#
# Table name: outdated_articles
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  article_id :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe OutdatedArticle, type: :model, basic: true do

  before(:all) do
    @user    = create(:user)
    @topic   = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)
  end

  before do
    @outdated_article = OutdatedArticle.create(
      article: @article,
      user:     @user
    )
  end

  subject { @outdated_article }

  context 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:article) }

    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to validate_presence_of(:article) }

    it { is_expected.to validate_uniqueness_of(:article_id).scoped_to(:user_id).with_message(I18n.t('activerecord.errors.models.outdated_article.already_outdated')) }
  end

  # context 'Properties' do
  #   it { is_expected.to have_activity }
  # end

end
