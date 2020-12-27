# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Article::Redirection, type: :model, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)
  end

  before do
    @article_redirection = Article::Redirection.create(
      article:       @article,
      previous_slug: @article.slug,
      current_slug:  @article.slug + '-2'
    )
  end

  subject { @article_redirection }

  context 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Associations' do
    it { is_expected.to belong_to(:article) }

    it { is_expected.to validate_presence_of(:previous_slug) }
    it { is_expected.to validate_presence_of(:current_slug) }
  end

end
