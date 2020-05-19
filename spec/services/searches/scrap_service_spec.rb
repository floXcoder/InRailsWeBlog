# frozen_string_literal: true

require 'rails_helper'

describe Searches::ScrapSearchService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user  = create(:user) # Create a default topic
    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic, title: 'article name', visibility: 'everyone', content: '<div>Article content containing a link: <a href="http://www.example.com/scrap_content">link name</a></div>')

    @article_no_link = create(:article, user: @user, topic: @topic, title: 'article name', visibility: 'everyone', content: '<div>Article content with no link</div>')
  end

  describe '#perform', search: true do
    before do
      stub_request(:get, 'http://www.example.com/scrap_content')
        .to_return(body: '<div>Body for external content with needed value: ruby is present inside external content and returned by stub</div>')
    end

    context 'with query and articles' do
      it 'returns all content matching query inside articles content' do
        results = Searches::ScrapSearchService.new('ruby', @article.id).perform

        expect(results.success?).to be true

        expect(results.result[@article.id][0]).to eq('http://www.example.com/scrap_content')
        expect(results.result[@article.id][1][0]).to match(/value: ruby is/)
      end
    end

    context 'with empty query' do
      it 'returns all content matching query inside articles content' do
        results = Searches::ScrapSearchService.new('', @article.id).perform

        expect(results.success?).to be true
        expect(results.result).to be_empty
      end
    end

    context 'with no links inside article' do
      it 'returns all content matching query inside articles content' do
        results = Searches::ScrapSearchService.new('ruby', @article_no_link.id).perform

        expect(results.success?).to be true
        expect(results.result).to be_empty
      end
    end
  end

end
