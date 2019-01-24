# frozen_string_literal: true

require 'rails_helper'

describe Articles::StoreService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user          = create(:user)
    @topic         = create(:topic, user: @user, visibility: :everyone)
    @stories_topic = create(:topic, user: @user, mode: :stories)
    @tag           = create(:tag, user: @user, name: 'Tag for article', visibility: 'only_me')

    @contributor_user = create(:user)
    @share            = create(:share, user: @user, shareable: @stories_topic, contributor: @contributor_user)
  end

  describe '#perform' do
    context 'when adding an article' do
      it 'returns a new article' do
        article        = @user.articles.build
        article_result = Articles::StoreService.new(article, topic_id: @topic.id, title: 'Article title', content: 'new content', visibility: 'only_me', tags: ["#{@tag.name},#{@tag.visibility}"], current_user: @user).perform

        expect(article_result.success?).to be true
        expect(article_result.result).to be_kind_of(Article)
        expect(article_result.result.content).to eq('new content')
      end

      it 'returns the correct mode' do
        note_article    = @user.articles.build
        article_results = Articles::StoreService.new(note_article, topic_id: @topic.id, title: 'Article note', content: 'new note', visibility: 'only_me', tags: ["#{@tag.name},#{@tag.visibility}"], current_user: @user).perform
        expect(article_results.success?).to be true
        expect(article_results.result).to be_kind_of(Article)
        expect(article_results.result.mode).to eq('note')

        story_article   = @user.articles.build
        article_results = Articles::StoreService.new(story_article, topic_id: @stories_topic.id, title: 'Article story', content: 'new story', visibility: 'only_me', tags: ["#{@tag.name},#{@tag.visibility}"], current_user: @user).perform
        expect(article_results.success?).to be true
        expect(article_results.result).to be_kind_of(Article)
        expect(article_results.result.mode).to eq('story')
      end
    end

    context 'when updating an article' do
      before do
        @article = create(:article, user: @user, topic: @topic, visibility: 'only_me')
      end

      it 'returns the updated article' do
        article_result = Articles::StoreService.new(@article, topic_id: @topic.id, content: 'updated content', visibility: 'only_me', current_user: @user).perform

        expect(article_result.success?).to be true
        expect(article_result.result).to be_kind_of(Article)
        expect(article_result.result.content).to eq('updated content')
        expect(article_result.result.contributor_id).to be_nil
      end
    end

    context 'when updating an article by a contributor' do
      before do
        @article = create(:article, user: @user, topic: @topic)
      end

      it 'returns the updated article' do
        article_result = Articles::StoreService.new(@article, topic_id: @topic.id, content: 'updated content by contributor', current_user: @contributor_user).perform

        expect(article_result.success?).to be true
        expect(article_result.result.content).to eq('updated content by contributor')
        expect(article_result.result.contributor_id).to eq(@contributor_user.id)
      end
    end
  end

end
