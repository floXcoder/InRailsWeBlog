# frozen_string_literal: true

require 'rails_helper'

describe Searches::AutocompleteService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user  = create(:user) # Create a default topic
    @topic = create(:topic, user: @user, visibility: :everyone)

    @tags     = create_list(:tag, 5, user: @user, visibility: :everyone) # Tags are generated with "tag" in name
    @articles = create_list(:article, 5, user: @user, topic: @topic, title: 'article name', visibility: :everyone, tags: [@tags[0]])

    @private_article = create(:article, user: @user, topic: @topic, title: 'article private name', visibility: :only_me, tags: [@tags[1]])

    @second_private_topic   = create(:topic, user: @user, visibility: :only_me)
    @second_private_article = create(:article, user: @user, topic: @second_private_topic, title: 'article private second name', visibility: :only_me, draft: true)

    @other_user            = create(:user)
    @other_topic           = create(:topic, user: @other_user)
    @other_tag             = create(:tag, user: @other_user, visibility: :everyone)
    @other_public_article  = create(:article, user: @other_user, topic: @other_topic, title: 'article public other name', visibility: :everyone, tags: [@other_tag])
    @other_private_article = create(:article, user: @other_user, topic: @other_topic, title: 'article private other name', visibility: :only_me, tags: [@other_tag])

    Article.reindex
    Article.search_index.refresh
    Tag.reindex
    Tag.search_index.refresh
    Topic.reindex
    Topic.search_index.refresh
  end

  describe '#perform', search: true do
    context 'without user' do
      context 'without params' do
        it 'returns all public articles, topics and tags' do
          results = Searches::AutocompleteService.new('*').perform

          expect(results.success?).to be true

          expect(results.result[:articles].size).to eq(Article.everyone.count)
          expect(results.result[:tags].size).to eq(Tag.everyone.count)
          expect(results.result[:topics].size).to eq(Topic.everyone.count)
        end
      end
    end

    context 'when user is set' do
      context 'without params' do
        it 'returns all public and private articles, topics and tags' do
          results = Searches::AutocompleteService.new('*', current_user: @user).perform

          expect(results.success?).to be true

          expect(results.result[:articles].size).to eq(Article.everyone_and_user(@user.id).count)
          expect(results.result[:tags].size).to eq(Tag.everyone_and_user(@user.id).count)
          expect(results.result[:topics].size).to eq(Topic.everyone_and_user(@user.id).count)
        end
      end
    end

    context 'when tag ids is set' do
      it 'returns articles for selected tags only' do
        results = Searches::AutocompleteService.new('*', current_user: @user, tag_ids: [@tags[1].id]).perform

        expect(results.success?).to be true

        expect(results.result[:articles].size).to eq(Article.with_tags(@tags[1].slug).count)
        # expect(results.result[:tags].size).to eq(Tag.everyone_and_user(@user.id).count)
        expect(results.result[:topics].size).to eq(Topic.everyone_and_user(@user.id).count)
      end
    end
  end

end
