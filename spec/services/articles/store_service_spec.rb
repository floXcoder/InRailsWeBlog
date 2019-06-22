# frozen_string_literal: true

require 'rails_helper'

describe Articles::StoreService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user          = create(:user)
    @public_topic  = create(:topic, user: @user, visibility: :everyone)
    @stories_topic = create(:topic, user: @user, mode: :stories)
    @public_tag    = create(:tag, user: @user, name: 'Tag for public article', visibility: :everyone)

    @private_topic = create(:topic, user: @user, visibility: :only_me)
    @private_tag   = create(:tag, user: @user, name: 'Tag for private article', visibility: :only_me)

    @inventories_topic = create(:topic, user: @user, mode: :inventories, inventory_fields: [{
                                                                                              field_name: 'string-required',
                                                                                              name:       'String required',
                                                                                              value_type: 'string_type',
                                                                                              required:   true
                                                                                            },
                                                                                            {
                                                                                              field_name: 'text',
                                                                                              name:       'Text',
                                                                                              value_type: 'text_type'
                                                                                            }
    ])

    @contributor_user = create(:user)
    @share            = create(:share, user: @user, shareable: @stories_topic, contributor: @contributor_user)
  end

  describe '#perform' do
    context 'when adding an article' do
      it 'returns a new article' do
        article        = @user.articles.build
        article_result = Articles::StoreService.new(article, topic_id: @public_topic.id, title: 'Article title', content: 'new content', visibility: 'only_me', tags: ["#{@private_tag.name},#{@private_tag.visibility}"], current_user: @user).perform

        expect(article_result.success?).to be true
        expect(article_result.result).to be_kind_of(Article)
        expect(article_result.result.content).to eq('new content')
      end

      it 'returns the correct mode' do
        note_article    = @user.articles.build
        article_results = Articles::StoreService.new(note_article, topic_id: @public_topic.id, title: 'Article note', content: 'new note', visibility: 'only_me', tags: ["#{@private_tag.name},#{@private_tag.visibility}"], current_user: @user).perform
        expect(article_results.success?).to be true
        expect(article_results.result).to be_kind_of(Article)
        expect(article_results.result.mode).to eq('note')

        story_article   = @user.articles.build
        article_results = Articles::StoreService.new(story_article, topic_id: @stories_topic.id, title: 'Article story', content: 'new story', visibility: 'only_me', tags: ["#{@private_tag.name},#{@private_tag.visibility}"], current_user: @user).perform
        expect(article_results.success?).to be true
        expect(article_results.result).to be_kind_of(Article)
        expect(article_results.result.mode).to eq('story')
      end

      it 'returns a new public article even if same private tag name exists' do
        private_article = @user.articles.build
        Articles::StoreService.new(private_article, topic_id: @private_topic.id, title: 'Article private', content: 'private content', visibility: 'only_me', tags: ["#{@private_tag.name},#{@private_tag.visibility}"], current_user: @user).perform

        public_article        = @user.articles.build
        public_article_result = Articles::StoreService.new(public_article, topic_id: @public_topic.id, title: 'Article public', content: 'public content', visibility: 'everyone', tags: ["#{@public_tag.name},#{@public_tag.visibility}"], current_user: @user).perform

        expect(public_article_result.success?).to be true
      end

      it 'returns a new article with inventory fields' do
        @user.update_attribute(:current_topic_id, @inventories_topic.id)

        inventory_article    = @user.articles.build
        article_results = Articles::StoreService.new(inventory_article, topic_id: @inventories_topic.id, title: 'Inventory article', inventories: { string_required: 'My string', text: '<p>My text</p>' }, visibility: 'only_me', tags: ["#{@private_tag.name},#{@private_tag.visibility}"], current_user: @user).perform

        expect(article_results.success?).to be true
        expect(article_results.result).to be_kind_of(Article)
        expect(article_results.result.mode).to eq('inventory')
        expect(article_results.result.inventories).not_to be_empty
      end
    end

    context 'when updating an article' do
      before do
        @article = create(:article, user: @user, topic: @public_topic, visibility: 'only_me')
      end

      it 'returns the updated article' do
        article_result = Articles::StoreService.new(@article, topic_id: @public_topic.id, content: 'updated content', visibility: 'only_me', current_user: @user).perform

        expect(article_result.success?).to be true
        expect(article_result.result).to be_kind_of(Article)
        expect(article_result.result.content).to eq('updated content')
        expect(article_result.result.contributor_id).to be_nil
      end
    end

    context 'when updating an article by a contributor' do
      before do
        @article = create(:article, user: @user, topic: @public_topic)
      end

      it 'returns the updated article' do
        article_result = Articles::StoreService.new(@article, topic_id: @public_topic.id, content: 'updated content by contributor', current_user: @contributor_user).perform

        expect(article_result.success?).to be true
        expect(article_result.result.content).to eq('updated content by contributor')
        expect(article_result.result.contributor_id).to eq(@contributor_user.id)
      end
    end
  end

end
