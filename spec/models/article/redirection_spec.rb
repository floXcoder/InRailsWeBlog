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

RSpec.describe Article::Relationship, type: :model, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @parent_article = create(:article, user: @user, topic: @topic)
    @child_article  = create(:article, user: @user, topic: @topic)
  end

  before do
    @article_relation = Article::Relationship.create(
      user:   @user,
      parent: @parent_article,
      child:  @child_article
    )
  end

  subject { @article_relation }

  context 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Associations' do
    it { is_expected.to belong_to(:user) }

    it { is_expected.to belong_to(:parent) }
    it { is_expected.to belong_to(:child) }

    it { is_expected.to validate_presence_of(:user) }

    it { is_expected.to validate_presence_of(:parent) }
    it { is_expected.to validate_presence_of(:child) }

    it { is_expected.to validate_uniqueness_of(:parent_id).scoped_to([:user_id, :child_id]).with_message(I18n.t('activerecord.errors.models.article_relationship.already_linked')) }
  end

end
