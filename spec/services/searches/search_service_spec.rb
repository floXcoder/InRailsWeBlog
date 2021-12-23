# frozen_string_literal: true

require 'rails_helper'

describe Searches::SearchService, type: :service do
  subject { described_class.new }

  before(:all) do
    @user  = create(:user) # Create a default topic
    @topic = create(:topic, user: @user)

    @tags     = create_list(:tag, 5, user: @user, visibility: 'everyone') # Tags are generated with "tag" in name
    @articles = create_list(:article, 5, user: @user, topic: @topic, title: 'article name', visibility: 'everyone')

    @private_article = create(:article, user: @user, topic: @topic, title: 'article private name', visibility: 'only_me')

    @inventories_topic = create(:topic, user: @user, mode: :inventories, inventory_fields: [{
                                                                                              field_name: 'string',
                                                                                              name:       'String',
                                                                                              value_type: 'string_type',
                                                                                              searchable: true
                                                                                            },
                                                                                            {
                                                                                              field_name: 'text',
                                                                                              name:       'Text',
                                                                                              value_type: 'text_type'
                                                                                            },
                                                                                            {
                                                                                              field_name: 'number',
                                                                                              name:       'Number',
                                                                                              value_type: 'number_type',
                                                                                              searchable: true,
                                                                                              filterable: true
                                                                                            }
    ])

    create(:article, user: @user, topic: @topic, title: 'article 1', inventories: { string: 'string 1', text: 'text 1', number: 1 })
    create(:article, user: @user, topic: @topic, title: 'article 2', inventories: { string: 'string 2', text: 'text 2', number: 1 })
    create(:article, user: @user, topic: @topic, title: 'article 3', inventories: { string: 'string 3', text: 'text 3', number: 2 })
    create(:article, user: @user, topic: @topic, title: 'article 4', inventories: { string: 'string 4', text: 'text 4', number: 3 })
    create(:article, user: @user, topic: @topic, title: 'article 5', inventories: { string: 'string 5', text: 'text 5', number: 3 })

    Article.reindex
    Article.search_index.refresh
    Tag.reindex
    Tag.search_index.refresh
    Topic.reindex
    Topic.search_index.refresh
  end

  describe '#perform', search: true do
    context 'without options' do
      it 'returns all public articles, topics and tags' do
        results = Searches::SearchService.new('*').perform

        expect(results.success?).to be true

        expect(results.result[:articles].size).to eq(Article.everyone.count)
        expect(results.result[:totalCount][:articles]).to eq(Article.everyone.count)

        expect(results.result[:tags].size).to eq(Tag.everyone.count)
        expect(results.result[:totalCount][:tags]).to eq(Tag.everyone.count)

        # expect(results.result[:topics].size).to eq(2)
        # expect(results.result[:totalCount][:topics]).to eq(2)
      end
    end

    context 'with inventory mode' do
      it 'returns aggregations' do
        @user.update_attribute(:current_topic_id, @inventories_topic.id)

        results = Searches::SearchService.new('string', current_user: @user).perform

        expect(results.success?).to be true

        expect(results.result[:articles].size).to eq(5)

        expect(results.result[:aggregations][:articles]).not_to be_empty
        expect(results.result[:aggregations][:articles].first[:aggs][1]).to eq(2)
      ensure
        @user.update_attribute(:current_topic_id, @topic.id)
      end

      it 'returns filtered results' do
        @user.update_attribute(:current_topic_id, @inventories_topic.id)

        results = Searches::SearchService.new('string', current_user: @user, filters: { number: [1, 2] }).perform

        expect(results.success?).to be true

        expect(results.result[:articles].size).to eq(3)
      ensure
        @user.update_attribute(:current_topic_id, @topic.id)
      end
    end
  end

end
