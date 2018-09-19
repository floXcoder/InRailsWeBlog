# frozen_string_literal: true

require 'rails_helper'

describe Articles::FindQueries, type: :query, basic: true do
  subject { described_class.new }

  before(:all) do
    @admin      = create(:admin)

    @user       = create(:user)

    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)

    @articles       = create_list(:article, 5, user: @user, topic: @topic)
    @second_article = create(:article, user: @user, topic: @topic)

    @second_topic    = create(:topic, user: @user)
    @private_article = create(:article, user: @user, topic: @second_topic, visibility: 'only_me')

    @other_user = create(:user)
    @other_topic = create(:topic, user: @other_user)
    @other_articles = create_list(:article, 3, user: @other_user, topic: @other_topic)
  end

  describe '#all' do
    context 'without params' do
      it 'returns all public articles' do
        articles = ::Articles::FindQueries.new.all

        expect(articles.count).to eq(Article.everyone.count)
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all public articles and user articles' do
        articles = ::Articles::FindQueries.new.all({}, @user)

        expect(articles.count).to eq(Article.everyone_and_user(@user.id).count)
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all public articles and user articles' do
        articles = ::Articles::FindQueries.new.all({}, @user, @admin)

        expect(articles.count).to eq(Article.all.count)
      end
    end

    context 'with filter params' do
      before(:all) do
        @tags                       = create_list(:tag, 3, user: @user)
        @article_with_tags          = create(:article_with_tags, user: @user, topic: @topic, tags: [@tags[0]])
        @article_with_relation_tags = create(:article_with_relation_tags, user: @user, topic: @topic, parent_tags: [@tags[0], @tags[1]], child_tags: [@tags[2]])
      end

      it { expect(::Articles::FindQueries.new.all(topic_id: @topic.id)).to include(@article) }
      it { expect(::Articles::FindQueries.new.all(parent_tag_slug: @tags[1].slug, child_tag_slug: @tags[2].slug)).to contain_exactly(@article_with_relation_tags) }

      it { expect(::Articles::FindQueries.new.all(parent_tag_slug: @tags[1].slug)).to contain_exactly(@article_with_relation_tags) }

      it { expect(::Articles::FindQueries.new.all(child_tag_slug: @tags[2].slug)).to contain_exactly(@article_with_relation_tags) }

      describe 'display parent article only' do
        before do
          @user.settings['article_child_tagged'] = false
          @user.save
        end

        it { expect(::Articles::FindQueries.new.all({ tag_slug: @tags[0].slug }, @user)).to contain_exactly(@article_with_tags) }
      end

      describe 'display all article for a tag' do
        before do
          @user.settings['article_child_tagged'] = true
          @user.save
        end

        it { expect(::Articles::FindQueries.new.all({ tag_slug: @tags[0].slug }, @user)).to contain_exactly(@article_with_tags, @article_with_relation_tags) }
      end
    end
  end

end
