# frozen_string_literal: true

require 'rails_helper'

describe Articles::FindQueries, type: :query do
  subject { described_class.new }

  before(:all) do
    @admin = create(:admin)

    @user             = create(:user)
    @public_topic     = create(:topic, user: @user, visibility: :everyone)
    @public_articles  = create_list(:article, 5, user: @user, topic: @public_topic, languages: ['en'])
    @private_topic    = create(:topic, user: @user)
    @private_articles = create_list(:article, 5, user: @user, topic: @private_topic, visibility: :only_me)

    @contributor_user             = create(:user)
    @contributor_topic            = create(:topic, user: @contributor_user, visibility: :everyone)
    @contributor_public_articles  = create_list(:article, 5, user: @contributor_user, topic: @contributor_topic, visibility: :everyone)
    @contributor_private_articles = create_list(:article, 5, user: @contributor_user, topic: @contributor_topic, visibility: :only_me)
    @share                        = create(:share, user: @user, shareable: @public_topic, contributor: @contributor_user)

    @other_user             = create(:user)
    @other_topic            = create(:topic, user: @other_user, visibility: :everyone, mode: :stories)
    @other_public_articles  = create_list(:article, 3, user: @other_user, topic: @other_topic, visibility: :everyone)
    @other_private_articles = create_list(:article, 3, user: @other_user, topic: @other_topic, visibility: :only_me)

    @other_lg_articles      = create(:article, user: @other_user, topic: @other_topic, visibility: :everyone, languages: ['fr'])
  end

  describe '#all' do
    context 'without user' do
      it 'returns all public articles for current language' do
        articles = ::Articles::FindQueries.new.all(limit: 100)

        expect(articles.count).to eq(Article.everyone.with_locale(I18n.locale).count)
        expect(articles.count).to eq(@public_articles.count + @contributor_public_articles.count + @other_public_articles.count)
      end

      # it 'returns all public articles limited to the pagination' do
      #   articles = ::Articles::FindQueries.new.all
      #
      #   expect(articles.count).to eq(InRailsWeBlog.settings.per_page)
      # end

      context 'when filtering by user' do
        it 'returns all user public articles (with id)' do
          articles = ::Articles::FindQueries.new.all(user_id: @user.id)

          expect(articles).to match_array(@public_articles)
        end

        it 'returns all user public articles (with slug)' do
          articles = ::Articles::FindQueries.new.all(user_slug: @user.slug)

          expect(articles).to match_array(@public_articles)
        end
      end

      context 'when filtering by topic only' do
        it 'returns no articles for public topic (with id)' do
          articles = ::Articles::FindQueries.new.all(topic_id: @public_topic.id)

          expect(articles).to match_array([])
        end

        it 'returns no articles for public topic (with slug)' do
          articles = ::Articles::FindQueries.new.all(topic_slug: @public_topic.slug)

          expect(articles).to match_array([])
        end

        it 'returns no articles for private topic (with id)' do
          articles = ::Articles::FindQueries.new.all(topic_id: @private_topic.id)

          expect(articles).to match_array([])
        end

        it 'returns no articles for private topic (with slug)' do
          articles = ::Articles::FindQueries.new.all(topic_slug: @private_topic.slug)

          expect(articles).to match_array([])
        end
      end

      context 'when filtering by user and topic' do
        it 'returns all public articles for public topic (with id)' do
          articles = ::Articles::FindQueries.new.all(user_id: @user.id, topic_id: @public_topic.id)

          expect(articles).to match_array(@public_articles)
        end

        it 'returns all public articles for public topic (with slug)' do
          articles = ::Articles::FindQueries.new.all(user_slug: @user.slug, topic_slug: @public_topic.slug)

          expect(articles).to match_array(@public_articles)
        end

        it 'returns no articles for private topic (with id)' do
          articles = ::Articles::FindQueries.new.all(user_id: @user.id, topic_id: @private_topic.id)

          expect(articles).to match_array([])
        end

        it 'returns no articles for private topic (with slug)' do
          articles = ::Articles::FindQueries.new.all(user_slug: @user.slug, topic_slug: @private_topic.slug)

          expect(articles).to match_array([])
        end
      end

      context 'when filtering by tags' do
        before do
          @tags              = create_list(:tag, 3, user: @user)
          @article_with_tags = create(:article, user: @user, topic: @public_topic, tags: [@tags[0]])
          @article           = create(:article, user: @user, topic: @public_topic, parent_tags: [@tags[0], @tags[1]], child_tags: [@tags[2]])
        end

        it { expect(::Articles::FindQueries.new(@user).all(user_id: @user.id, topic_id: @public_topic.id)).to include(@article) }

        it { expect(::Articles::FindQueries.new(@user).all(parent_tag_slug: @tags[1].slug, child_tag_slug: @tags[2].slug)).to contain_exactly(@article) }

        it { expect(::Articles::FindQueries.new(@user).all(parent_tag_slug: @tags[1].slug)).to contain_exactly(@article) }

        it { expect(::Articles::FindQueries.new(@user).all(child_tag_slug: @tags[2].slug)).to contain_exactly(@article) }

        describe 'display parent article only' do
          before do
            @user.settings['tag_parent_and_child'] = false
            @user.save
          end

          it { expect(::Articles::FindQueries.new(@user).all({ tag_slug: @tags[0].slug })).to contain_exactly(@article_with_tags) }
        end

        describe 'display all article for a tag' do
          before do
            @user.settings['tag_parent_and_child'] = true
            @user.save
          end

          it { expect(::Articles::FindQueries.new(@user).all({ tag_slug: @tags[0].slug })).to contain_exactly(@article_with_tags, @article) }
        end
      end
    end

    context 'when owner is set' do
      it 'returns all public and user articles for all languages' do
        articles = ::Articles::FindQueries.new(@user).all(limit: 100)

        expect(articles).to match_array(Article.everyone_and_user(@user.id))
      end

      context 'when filtering by user' do
        it 'returns all user public articles (with id)' do
          articles = ::Articles::FindQueries.new(@user).all(user_id: @user.id)

          expect(articles).to match_array(@public_articles + @private_articles)
        end

        it 'returns all user public articles (with slug)' do
          articles = ::Articles::FindQueries.new(@user).all(user_slug: @user.slug)

          expect(articles).to match_array(@public_articles + @private_articles)
        end
      end

      context 'when filtering by topic only' do
        it 'returns no articles for public topic (with id)' do
          articles = ::Articles::FindQueries.new(@user).all(topic_id: @public_topic.id)

          expect(articles).to match_array([])
        end

        it 'returns no articles for public topic (with slug)' do
          articles = ::Articles::FindQueries.new(@user).all(topic_slug: @public_topic.slug)

          expect(articles).to match_array([])
        end

        it 'returns no articles for private topic (with id)' do
          articles = ::Articles::FindQueries.new(@user).all(topic_id: @private_topic.id)

          expect(articles).to match_array([])
        end

        it 'returns no articles for private topic (with slug)' do
          articles = ::Articles::FindQueries.new(@user).all(topic_slug: @private_topic.slug)

          expect(articles).to match_array([])
        end
      end

      context 'when filtering by user and topic' do
        it 'returns all public articles for public topic (with id)' do
          articles = ::Articles::FindQueries.new(@user).all(user_id: @user.id, topic_id: @public_topic.id)

          expect(articles).to match_array(@public_articles)
        end

        it 'returns all public articles for public topic (with slug)' do
          articles = ::Articles::FindQueries.new(@user).all(user_slug: @user.slug, topic_slug: @public_topic.slug)

          expect(articles).to match_array(@public_articles)
        end

        it 'returns no articles for private topic (with id)' do
          articles = ::Articles::FindQueries.new(@user).all(user_id: @user.id, topic_id: @private_topic.id)

          expect(articles).to match_array(@private_articles)
        end

        it 'returns no articles for private topic (with slug)' do
          articles = ::Articles::FindQueries.new(@user).all(user_slug: @user.slug, topic_slug: @private_topic.slug)

          expect(articles).to match_array(@private_articles)
        end
      end

      context 'when sorting articles' do
        it 'returns articles by descendant date fo creation by default' do
          articles = ::Articles::FindQueries.new(@user).all(user_id: @user.id, topic_id: @public_topic.id)

          expect(articles).to match_array(@public_articles)
          expect(articles.first).to eq(@public_articles.sort_by(&:created_at).last)
        end

        it 'returns articles by ascendant date' do
          articles = ::Articles::FindQueries.new(@user).all(user_id: @user.id, topic_id: @public_topic.id, order: 'created_asc')

          expect(articles).to match_array(@public_articles)
          expect(articles.first).to eq(@public_articles.sort_by(&:created_at).first)
        end

        it 'returns articles by priority according to user setting' do
          @user.update(article_order: 'priority_asc')

          articles = ::Articles::FindQueries.new(@user).all(user_id: @user.id, topic_id: @public_topic.id)

          expect(articles).to match_array(@public_articles)
          expect(articles.first).to eq(@public_articles.sort_by(&:priority).first)
        end

        it 'returns articles by topic priority setting' do
          @public_topic.update(article_order: 'created_desc')

          articles = ::Articles::FindQueries.new(@user).all(user_id: @user.id, topic_id: @public_topic.id)

          expect(articles).to match_array(@public_articles)
          expect(articles.first).to eq(@public_articles.sort_by(&:created_at).last)
        end
      end

      context 'when filtering by tags' do
        before do
          @tags              = create_list(:tag, 3, user: @user)
          @article_with_tags = create(:article, user: @user, topic: @public_topic, tags: [@tags[0]])
          @article           = create(:article, user: @user, topic: @public_topic, parent_tags: [@tags[0], @tags[1]], child_tags: [@tags[2]])
        end

        it { expect(::Articles::FindQueries.new(@user).all(user_id: @user.id, topic_id: @public_topic.id)).to include(@article) }

        it { expect(::Articles::FindQueries.new(@user).all(parent_tag_slug: @tags[1].slug, child_tag_slug: @tags[2].slug)).to contain_exactly(@article) }

        it { expect(::Articles::FindQueries.new(@user).all(parent_tag_slug: @tags[1].slug)).to contain_exactly(@article) }

        it { expect(::Articles::FindQueries.new(@user).all(child_tag_slug: @tags[2].slug)).to contain_exactly(@article) }

        describe 'display parent article only' do
          before do
            @user.settings['tag_parent_and_child'] = false
            @user.save
          end

          it { expect(::Articles::FindQueries.new(@user).all({ tag_slug: @tags[0].slug })).to contain_exactly(@article_with_tags) }
        end

        describe 'display all article for a tag' do
          before do
            @user.settings['tag_parent_and_child'] = true
            @user.save
          end

          it { expect(::Articles::FindQueries.new(@user).all({ tag_slug: @tags[0].slug })).to contain_exactly(@article_with_tags, @article) }
        end
      end
    end

    context 'when contributor is set' do
      context 'when filtering by user and shared topic' do
        it 'returns all public articles for shared topic (with id)' do
          articles = ::Articles::FindQueries.new(@contributor_user).all(user_id: @user.id, topic_id: @public_topic.id)

          expect(articles).to match_array(@public_articles)
        end

        it 'returns all public articles for shared topic (with slug)' do
          articles = ::Articles::FindQueries.new(@contributor_user).all(user_slug: @user.slug, topic_slug: @public_topic.slug)

          expect(articles).to match_array(@public_articles)
        end

        it 'returns no articles for private topic (with id)' do
          articles = ::Articles::FindQueries.new(@contributor_user).all(user_id: @user.id, topic_id: @private_topic.id)

          expect(articles).to match_array([])
        end

        it 'returns no articles for private topic (with slug)' do
          articles = ::Articles::FindQueries.new(@contributor_user).all(user_slug: @user.slug, topic_slug: @private_topic.slug)

          expect(articles).to match_array([])
        end
      end
    end

    context 'when admin is set' do
      it 'returns all public articles and user articles for all languages' do
        articles = ::Articles::FindQueries.new(@user, @admin).all(limit: 100)

        expect(articles.count).to eq(Article.all.count)
      end
    end
  end

  describe '#recommendations' do
    context 'without params' do
      it 'returns no articles' do
        articles = ::Articles::FindQueries.new.recommendations

        expect(articles).to match_array([])
      end

      it 'returns articles only with the same language' do
        articles = ::Articles::FindQueries.new.recommendations(article: @other_public_articles.last)

        expect(articles).not_to include(@other_lg_articles)
      end
    end

    context 'when article topic is a story' do
      it 'returns the previous and the new articles of the story' do
        articles = ::Articles::FindQueries.new.recommendations(article: @other_public_articles.second)

        expect(articles).to match_array([@other_public_articles.first, @other_public_articles.last])
      end
    end

    context 'when article topic is not a story' do
      it 'returns 2 articles ordered by priority' do
        articles = ::Articles::FindQueries.new.recommendations(article: @public_articles.first)

        expect(articles).to match_array(@public_articles.sort_by { |a| -a.priority }[0..1])
      end
    end
  end

  describe '#home' do
    before do
      @other_public_articles.map do |article|
        article.tracker.home_page = true
        article.tracker.save
      end
      @other_private_articles.map do |article|
        article.tracker.home_page = true
        article.tracker.save
      end
    end

    context 'without params' do
      it 'returns public articles marked for home' do
        articles = ::Articles::FindQueries.new.home

        expect(articles).to match_array(@other_public_articles)
      end
    end
  end

  describe '#populars' do
    before do
      popularity = 10
      @other_public_articles.map do |article|
        article.tracker.popularity = popularity
        article.tracker.save
        popularity += 1
      end
      @other_private_articles.map do |article|
        article.tracker.popularity = popularity
        article.tracker.save
        popularity += 1
      end
    end

    context 'without params' do
      it 'returns public articles marked for home' do
        articles = ::Articles::FindQueries.new.populars(limit: @other_public_articles.count)

        expect(articles).to match_array(@other_public_articles)
        expect(articles.first.id).to eq(@other_public_articles.last.id)
      end
    end
  end

end
