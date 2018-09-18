# frozen_string_literal: true

require 'rails_helper'

describe Articles::AutocompleteService, type: :service, basic: true do
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
        article_autocompletes = Articles::AutocompleteService.new('tit').perform

        expect(article_autocompletes.success?).to be true
        expect(article_autocompletes.result[:articles]).to be_kind_of(Array)
        expect(article_autocompletes.result[:articles].size).to eq(5)
      end
    end
  end
end
