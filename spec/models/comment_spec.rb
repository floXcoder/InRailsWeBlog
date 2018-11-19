# frozen_string_literal: true

# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  commentable_type :string           not null
#  commentable_id   :integer          not null
#  user_id          :integer          not null
#  title            :string
#  body             :text
#  subject          :string
#  rating           :integer          default(0)
#  positive_reviews :integer          default(0)
#  negative_reviews :integer          default(0)
#  accepted         :boolean          default(TRUE), not null
#  ask_for_deletion :boolean          default(FALSE), not null
#  deleted_at       :datetime
#  parent_id        :integer
#  lft              :integer
#  rgt              :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
require 'rails_helper'

RSpec.describe Comment, type: :model, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @commentable = create(:article, user: @user, topic: @topic)
  end

  before do
    @comment = Comment.create(
      user:             @user,
      commentable:      @commentable,
      title:            'My comment title',
      subject:          'My comment subject',
      body:             'My comment body',
      rating:           5,
      positive_reviews: 10,
      negative_reviews: 12,
      accepted:         true,
      ask_for_deletion: false
    )
  end

  subject { @comment }

  context 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Attributes' do
    it { is_expected.to respond_to(:commentable_id) }
    it { is_expected.to respond_to(:commentable_type) }
    it { is_expected.to respond_to(:user_id) }
    it { is_expected.to respond_to(:title) }
    it { is_expected.to respond_to(:subject) }
    it { is_expected.to respond_to(:body) }
    it { is_expected.to respond_to(:rating) }
    it { is_expected.to respond_to(:positive_reviews) }
    it { is_expected.to respond_to(:negative_reviews) }
    it { is_expected.to respond_to(:parent_id) }
    it { is_expected.to respond_to(:lft) }
    it { is_expected.to respond_to(:rgt) }
    it { is_expected.to respond_to(:accepted) }
    it { is_expected.to respond_to(:ask_for_deletion) }

    it { expect(@comment.user_id).to eq(@user.id) }
    it { expect(@comment.commentable_id).to eq(@commentable.id) }
    it { expect(@comment.commentable_type).to eq('Article') }
    it { expect(@comment.title).to match 'My comment title' }
    it { expect(@comment.subject).to match 'My comment subject' }
    it { expect(@comment.body).to match 'My comment body' }
    it { expect(@comment.rating).to eq(5) }
    it { expect(@comment.accepted).to be true }
    it { expect(@comment.ask_for_deletion).to be false }

    describe '#user' do
      it { is_expected.to validate_presence_of(:user) }
      it { is_expected.to have_db_index(:user_id) }
    end

    describe '#commentable' do
      it { is_expected.to validate_presence_of(:commentable) }
      it { is_expected.to have_db_index([:commentable_id, :commentable_type]) }
    end

    describe '#title' do
      # it { is_expected.to validate_length_of(:title).is_at_least(CONFIG.comment_title_min_length) }
      it { is_expected.to validate_length_of(:title).is_at_most(CONFIG.comment_title_max_length) }
    end

    describe '#body' do
      it { is_expected.to validate_presence_of(:body) }
      it { is_expected.to validate_length_of(:body).is_at_least(CONFIG.comment_body_min_length) }
      it { is_expected.to validate_length_of(:body).is_at_most(CONFIG.comment_body_max_length) }
    end

    describe 'Default Attributes' do
      before do
        @comment = Comment.create(
          user:             @user,
          commentable:      @commentable,
          body:             'My comment body'
        )
      end

      it { expect(@comment).to be_valid }
      it { expect(@comment.rating).to eq(0) }
      it { expect(@comment.positive_reviews).to eq(0) }
      it { expect(@comment.negative_reviews).to eq(0) }
      it { expect(@comment.accepted).to be true }
    end
  end

  context 'Properties' do
    it { is_expected.to have_strip_attributes([:title, :subject]) }

    # it { is_expected.to have_activity }

    it { is_expected.to act_as_paranoid(Comment) }
  end

  context 'Associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:commentable) }
  end

  context 'Public Methods' do
    subject { Comment }

    let!(:comment1) { create(:comment, user: @user, commentable: @commentable) }
    let!(:comment2) { create(:comment, user: @user, commentable: @commentable) }
    let!(:comment_other) { create(:comment, user: create(:user), commentable: create(:article, user: @user, topic: @topic), title: 'Other comment') }

    describe '::find_comments_by_user' do
      it { is_expected.to respond_to(:find_comments_by_user) }
      it { expect(Comment.find_comments_by_user(@user)).to match_array([comment2, comment1, @comment]) }
    end

    describe '::find_comments_for_commentable' do
      it { is_expected.to respond_to(:find_comments_for_commentable) }
      it { expect(Comment.find_comments_for_commentable(@commentable.class.name, @commentable.id)).to match_array([comment2, comment1, @comment]) }
    end

    describe '::find_commentable' do
      it { is_expected.to respond_to(:find_commentable) }
      it { expect(Comment.find_commentable('Article', @commentable.id)).to eq(@commentable) }
    end

    describe '::build_from' do
      it { is_expected.to respond_to(:build_from) }
      it { expect(Comment.build_from(@commentable, @user, 'my message')).to be_a(Comment) }
    end

    describe '::filter_by' do
      it { is_expected.to respond_to(:filter_by) }
      it { expect(Comment.filter_by(Comment.all, accepted: true).size).to eq(4) }
    end

    describe '::order_by' do
      it { is_expected.to respond_to(:order_by) }
      it { expect(Comment.order_by('id_desc').size).to eq(4) }
    end
  end

  context 'Instance Methods' do
    describe '.has_children?' do
      it { is_expected.to respond_to(:has_children?) }

      it 'has no children' do
        expect(@comment.has_children?).to be false
      end

      # it 'has one child' do
      #   create(:comment, user: user, commentable: commentable, parent_id: @comment)
      #   expect(@comment.has_children?).to be true
      # end
    end

    describe '.destroy_with_children' do
      it { is_expected.to respond_to(:destroy_with_children) }
    end
  end

end
