# frozen_string_literal: true

# == Schema Information
#
# Table name: article_redirections
#
#  id            :bigint           not null, primary key
#  article_id    :bigint           not null
#  previous_slug :string           not null
#  current_slug  :string           not null
#  locale        :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
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
