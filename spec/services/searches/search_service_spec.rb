# frozen_string_literal: true

require 'rails_helper'

describe Searches::SearchService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user  = create(:user) # Create a default topic
    @topic = create(:topic, user: @user)

    @tags = create_list(:tag, 5, user: @user, visibility: 'everyone') # Tags are generated with "tag" in name
    @articles = create_list(:article, 5, user: @user, topic: @topic, title: 'article name', visibility: 'everyone')

    @private_article = create(:article, user: @user, topic: @topic, title: 'article private name', visibility: 'only_me')

    Article.reindex
    Article.search_index.refresh
    Tag.reindex
    Tag.search_index.refresh
    Topic.reindex
    Topic.search_index.refresh
  end

  describe '#perform', search: true do
    context 'without options' do
      it 'returns all articles, topics and tags' do
        results = Searches::SearchService.new('*').perform

        expect(results.success?).to be true

        expect(results.result[:articles].size).to eq(5)
        expect(results.result[:totalCount][:articles]).to eq(5)

        expect(results.result[:tags].size).to eq(5 + 5)
        expect(results.result[:totalCount][:tags]).to eq(5 + 5)

        # expect(results.result[:topics].size).to eq(2)
        # expect(results.result[:totalCount][:topics]).to eq(2)
      end
    end
  end

end
