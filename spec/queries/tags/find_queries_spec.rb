# frozen_string_literal: true

require 'rails_helper'

describe Tags::FindQueries, type: :query, basic: true do
  subject { described_class.new }

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
    @admin      = create(:admin)

    @tag = create(:tag, user: @user)

    @tags       = create_list(:tag, 5, user: @user)
    @second_tag = create(:tag, user: @user)

    @private_tag = create(:tag, user: @user, visibility: 'only_me')

    @other_tags = create_list(:tag, 3, user: @other_user)
  end

  describe '#all' do
    context 'without params' do
      it 'returns all public tags' do
        tags = ::Tags::FindQueries.new.all

        expect(tags.count).to eq(Tag.everyone.count)
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all public tags and user tags' do
        tags = ::Tags::FindQueries.new(@user).all({})

        expect(tags.count).to eq(Tag.everyone_and_user(@user.id).count)
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all public tags and user tags' do
        tags = ::Tags::FindQueries.new(@user, @admin).all({})

        expect(tags.count).to eq(Tag.all.count)
      end
    end

    context 'with filter params' do
      before do
        @topic = create(:topic, user: @user)
        @article = create(:article, user: @user, topic: @topic)

        @tag.tagged_articles.create(user: @user, topic: @topic, article: @article)
      end

      it { expect(::Tags::FindQueries.new.all(user_id: @user.id, topic_id: @topic.id)).to include(@tag) }
    end
  end

end
