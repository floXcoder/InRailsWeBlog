# frozen_string_literal: true

require 'rails_helper'

describe Articles::StoreService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)
    @tag   = create(:tag, user: @user, name: 'Tag for article', visibility: 'only_me')
  end

  describe '#perform' do
    context 'with new article' do
      it 'returns a new article' do
        article         = @user.articles.build
        article_results = Articles::StoreService.new(article, topic_id: @topic.id, title: 'Article title', content: 'new content', visibility: 'only_me', tags: ["#{@tag.name},#{@tag.visibility}"], current_user: @user).perform

        expect(article_results.success?).to be true
        expect(article_results.result).to be_kind_of(Article)
        expect(article_results.result.content).to eq('new content')
      end
    end

    context 'with existing article' do
      before(:all) do
        @article = create(:article, user: @user, topic: @topic, visibility: 'only_me')
      end

      it 'returns an updated article' do
        article_results = Articles::StoreService.new(@article, topic_id: @topic.id, content: 'updated content', visibility: 'only_me').perform

        expect(article_results.success?).to be true
        expect(article_results.result).to be_kind_of(Article)
        expect(article_results.result.content).to eq('updated content')
      end
    end
  end

end
