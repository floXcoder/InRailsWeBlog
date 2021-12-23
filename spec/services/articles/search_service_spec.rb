# frozen_string_literal: true

require 'rails_helper'

describe Articles::SearchService, type: :service do
  subject { described_class.new }

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @articles = create_list(:article, 5, user: @user, topic: @topic, title: 'Article title')
    create_list(:article, 3, user: @user, topic: @topic, title: 'Article name')

    Article.reindex
    Article.search_index.refresh
  end

  describe '#perform', search: true do
    context 'without options' do
      it 'returns all articles' do
        article_results = Articles::SearchService.new('title').perform

        expect(article_results.success?).to be true
        expect(article_results.result[:articles]).to be_kind_of(Array)
        expect(article_results.result[:articles].size).to eq(5)
      end
    end

    context 'with strict mode' do
      it 'returns strict articles' do
        article_results = Articles::SearchService.new('name', format: :strict).perform

        expect(article_results.success?).to be true
        expect(article_results.result[:articles]).to be_kind_of(Array)
        expect(article_results.result[:articles].size).to eq(3)
      end
    end

    context 'with ordering' do
      it 'returns ordered' do
        article_results = Articles::SearchService.new('title', order: 'created_desc').perform

        expect(article_results.success?).to be true
        expect(article_results.result[:articles]).to be_kind_of(Array)
        expect(article_results.result[:articles].size).to eq(5)
        expect(article_results.result[:articles].first[:id]).to eq(@articles.last.id)
      end
    end
  end

  # Take into account:
  # Language when creating
  # Language when updating
  # Highlight option
  # Current language when getting data with translation helper
  # it 'search for articles in multi-languages' do
  #   begin
  #     I18n.locale = :fr
  #     article_fr = create(:article, user: @user, topic: @topic, content: 'language in french', languages: ['fr'])
  #     multi_lg_article = create(:article, user: @user, topic: @topic, content: 'language in french', languages: ['fr'])
  #     I18n.locale = :en
  #     article_en = create(:article, user: @user, topic: @topic, content: 'language in english', languages: ['en'])
  #     multi_lg_article.update(content: 'language in english', languages: ['en', 'fr'])
  #
  #     I18n.locale = :fr
  #     article_results = Article.search_for('language', highlight: true)[:articles]
  #
  #     I18n.locale = :en
  #     article_results = Article.search_for('language', highlight: true)[:articles]
  #
  #   ensure
  #     I18n.locale = :fr
  #   end
  # end

end
