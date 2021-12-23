# frozen_string_literal: true

# == Schema Information
#
# Table name: article_relationships
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  parent_id  :bigint           not null
#  child_id   :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe Article::Relationship, type: :model do

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
