# frozen_string_literal: true

require 'rails_helper'

describe Articles::StoreService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)
  end

  describe '#perform' do
    context 'with new article' do
      it 'returns a new article' do
        article         = @user.articles.build
        article_results = Articles::StoreService.new(article, topic_id: @topic.id, content: 'new content').perform

        expect(article_results.success?).to be true
        expect(article_results.result).to be_kind_of(Article)
        expect(article_results.result.content).to eq('new content')
      end
    end

    context 'with existing article' do
      it 'returns an updated article' do
        article_results = Articles::StoreService.new(@article, topic_id: @topic.id, content: 'updated content').perform

        expect(article_results.success?).to be true
        expect(article_results.result).to be_kind_of(Article)
        expect(article_results.result.content).to eq('updated content')
      end
    end
  end

end
