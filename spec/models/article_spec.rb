# == Schema Information
#
# Table name: articles
#
#  id                      :integer          not null, primary key
#  user_id                 :integer
#  topic_id                :integer
#  title                   :string
#  summary                 :text
#  content                 :text             not null
#  reference               :text
#  draft                   :boolean          default(FALSE), not null
#  language                :string
#  allow_comment           :boolean          default(TRUE), not null
#  notation                :integer          default(0)
#  priority                :integer          default(0)
#  visibility              :integer          default("everyone"), not null
#  accepted                :boolean          default(TRUE), not null
#  archived                :boolean          default(FALSE), not null
#  pictures_count          :integer          default(0)
#  outdated_articles_count :integer          default(0)
#  bookmarks_count         :integer          default(0)
#  comments_count          :integer          default(0)
#  slug                    :string
#  deleted_at              :datetime
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#
require 'rails_helper'

RSpec.describe Article, type: :model, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)
  end

  before do
    @article = Article.create(
      user:          @user,
      topic:         @topic,
      title:         'My title',
      summary:       'Summary of my article',
      content:       'Content of my article',
      reference:     'Reference link',
      language:      'fr',
      visibility:    'everyone',
      notation:      1,
      priority:      1,
      draft:         false,
      allow_comment: false,
      archived:      false,
      accepted:      true
    )
  end

  subject { @article }

  describe 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Attributes' do
    it { is_expected.to respond_to(:title) }
    it { is_expected.to respond_to(:summary) }
    it { is_expected.to respond_to(:content) }
    it { is_expected.to respond_to(:reference) }
    it { is_expected.to respond_to(:draft) }
    it { is_expected.to respond_to(:language) }
    it { is_expected.to respond_to(:allow_comment) }
    it { is_expected.to respond_to(:notation) }
    it { is_expected.to respond_to(:priority) }
    it { is_expected.to respond_to(:visibility) }
    it { is_expected.to respond_to(:archived) }
    it { is_expected.to respond_to(:accepted) }
    it { is_expected.to respond_to(:pictures_count) }
    it { is_expected.to respond_to(:outdated_articles_count) }
    it { is_expected.to respond_to(:bookmarks_count) }
    it { is_expected.to respond_to(:comments_count) }

    it { expect(@article.title).to eq('My title') }
    it { expect(@article.summary).to eq('Summary of my article') }
    it { expect(@article.content).to eq('Content of my article') }
    it { expect(@article.reference).to eq('Reference link') }
    it { expect(@article.language).to eq('fr') }
    it { expect(@article.notation).to eq(1) }
    it { expect(@article.priority).to eq(1) }
    it { expect(@article.visibility).to eq('everyone') }
    it { expect(@article.draft).to be false }
    it { expect(@article.allow_comment).to be false }
    it { expect(@article.archived).to be false }
    it { expect(@article.accepted).to be true }
    it { expect(@article.bookmarks_count).to eq(0) }
    it { expect(@article.outdated_articles_count).to eq(0) }
    it { expect(@article.bookmarks_count).to eq(0) }
    it { expect(@article.comments_count).to eq(0) }

    describe 'Default Attributes' do
      before do
        @article = Article.create(
          user:    @user,
          content: 'Content of my article'
        )
      end

      it { expect(@article.notation).to eq(0) }
      it { expect(@article.priority).to eq(0) }
      it { expect(@article.visibility).to eq('everyone') }
      it { expect(@article.draft).to be false }
      it { expect(@article.allow_comment).to be true }
      it { expect(@article.archived).to be false }
      it { expect(@article.accepted).to be true }
      it { expect(@article.bookmarks_count).to eq(0) }
      it { expect(@article.outdated_articles_count).to eq(0) }
      it { expect(@article.bookmarks_count).to eq(0) }
      it { expect(@article.comments_count).to eq(0) }
    end

    describe '#title' do
      it { is_expected.to validate_length_of(:title).is_at_least(CONFIG.article_title_min_length) }
      it { is_expected.to validate_length_of(:title).is_at_most(CONFIG.article_title_max_length) }
    end

    describe '#summary' do
      it { is_expected.to validate_length_of(:summary).is_at_least(CONFIG.article_summary_min_length) }
      it { is_expected.to validate_length_of(:summary).is_at_most(CONFIG.article_summary_max_length) }
    end

    describe '#content' do
      it { is_expected.to validate_length_of(:content).is_at_least(CONFIG.article_content_min_length) }
      it { is_expected.to validate_length_of(:content).is_at_most(CONFIG.article_content_max_length) }
    end

    describe '#notation' do
      it { is_expected.to validate_inclusion_of(:notation).in_range(CONFIG.notation_min..CONFIG.notation_max) }
    end

    describe '#visibility' do
      it { is_expected.to have_enum(:visibility) }
      it { is_expected.to validate_presence_of(:visibility) }
    end

    describe '#topic_id' do
      it 'returns an error if topic does not own by same user than article' do
        other_user = create(:user)
        other_topic = create(:topic, user: other_user)

        new_article = build(:article, user: @user, topic: other_topic)
        expect(new_article.save).to be false
        expect(new_article.errors[:topic].first).to eq(I18n.t('activerecord.errors.models.article.bad_topic_owner'))

        updated_article = create(:article, user: @user, topic: @topic)
        updated_article.topic_id = other_topic.id
        expect(updated_article.save).to be false
        expect(updated_article.errors[:topic].first).to eq(I18n.t('activerecord.errors.models.article.bad_topic_owner'))
      end
    end
  end

  context 'Associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to have_db_index([:user_id, :visibility]) }

    it { is_expected.to belong_to(:topic) }
    it { is_expected.to have_db_index([:topic_id, :visibility]) }

    it { is_expected.to have_many(:tagged_articles) }
    it { is_expected.to have_many(:tags) }
    it { is_expected.to have_many(:parent_tags) }
    it { is_expected.to have_many(:child_tags) }
    it { is_expected.to have_many(:tag_relationships) }

    it { is_expected.to have_many(:outdated_articles) }
    it { is_expected.to have_many(:marked_as_outdated) }

    it { is_expected.to have_many(:parent_relationships) }
    it { is_expected.to have_many(:child_relationships) }

    it { is_expected.to have_many(:bookmarks) }
    it { is_expected.to have_many(:user_bookmarks) }
    it { is_expected.to have_many(:followers) }

    it { is_expected.to have_many(:pictures) }
    it { is_expected.to accept_nested_attributes_for(:pictures) }
  end

  context 'Properties' do
    it { is_expected.to have_strip_attributes([:title, :summary, :language]) }

    it { is_expected.to have_friendly_id(:slug) }

    it { is_expected.to act_as_tracked(Article) }

    it { is_expected.to have_activity }

    it { is_expected.to acts_as_commentable(Article) }

    it { is_expected.to acts_as_voteable(Article) }

    it { is_expected.to have_paper_trail(Article) }

    it { is_expected.to have_search(Article) }

    it { is_expected.to act_as_paranoid(Article) }

    it 'uses counter cache for pictures' do
      picture = create(:picture, user: @user, imageable_type: 'Article')
      expect {
        @article.pictures << picture
      }.to change(@article.reload, :pictures_count).by(1)
    end

    it 'uses counter cache for outdated articles' do
      expect {
        @article.outdated_articles.create(user: @user)
      }.to change(@article.reload, :outdated_articles_count).by(1)
    end

    it 'uses counter cache for bookmarks' do
      bookmark = create(:bookmark, user: @user, bookmarked: @article)
      expect {
        @article.bookmarks << bookmark
      }.to change(@article.reload, :bookmarks_count).by(1)
    end

    it 'uses counter cache for comments' do
      expect {
        comment = create(:comment, user: @user, commentable: @article)
        @article.new_comment(comment)
      }.to change(@article.reload, :comments_count).by(1)
    end
  end

  context 'Public Methods' do
    subject { Article }

    let!(:private_article) { create(:article, user: @user, topic: @topic, visibility: 'only_me') }

    let!(:other_user) { create(:user) }
    let!(:other_topic) { create(:topic, user: other_user) }
    let!(:other_article) { create(:article, user: other_user, topic: other_topic, visibility: 'everyone', draft: true, title: 'Title 2') }

    let!(:tag_parent) { create(:tag, user: @user, name: 'Tag parent') }
    let!(:tag_child) { create(:tag, user: @user, name: 'Tag children') }

    let!(:other_tag) { create(:tag, user: @user, name: 'Tag other') }

    before do
      @article.tagged_articles.create(user: @user, topic: @topic, tag: tag_parent, parent: true)
      @article.tagged_articles.create(user: @user, topic: @topic, tag: tag_child, child: true)

      other_article.tagged_articles.create(user: @user, topic: other_topic, tag: tag_parent)

      private_article.tagged_articles.create(user: @user, topic: other_topic, tag: other_tag)

      @article.bookmarks << create(:bookmark, user: @user, bookmarked: @article)
    end

    describe '::everyone_and_user' do
      it { is_expected.to respond_to(:everyone_and_user) }
      it { expect(Article.everyone_and_user).to include(@article, other_article) }
      it { expect(Article.everyone_and_user).not_to include(private_article) }
      it { expect(Article.everyone_and_user(@user.id)).to include(@article, private_article, other_article) }
    end

    describe '::with_visibility' do
      it { is_expected.to respond_to(:with_visibility) }
      it { expect(Article.with_visibility('only_me')).to include(private_article) }
      it { expect(Article.with_visibility('only_me')).not_to include(other_article) }
      it { expect(Article.with_visibility(1)).to include(private_article) }
      it { expect(Article.with_visibility(1)).not_to include(other_article) }
    end

    describe '::from_user' do
      it { is_expected.to respond_to(:from_user) }
      it { expect(Article.from_user(@user.id)).to include(@article) }
      it { expect(Article.from_user(@user.id)).not_to include(other_article) }
      it { expect(Article.from_user(@user.id)).not_to include(private_article) }
      it { expect(Article.from_user(@user.id, @user.id)).to include(@article, private_article) }
      it { expect(Article.from_user(@user.id, @user.id)).not_to include(other_article) }
    end

    describe '::from_topic' do
      it { is_expected.to respond_to(:from_topic) }
      it { expect(Article.from_topic(@topic.slug)).to include(@article) }
      it { expect(Article.from_topic(other_topic.slug)).not_to include(@article) }
    end

    describe '::from_topic_id' do
      it { is_expected.to respond_to(:from_topic_id) }
      it { expect(Article.from_topic_id(@topic.id)).to include(@article) }
      it { expect(Article.from_topic_id(other_topic.id)).not_to include(@article) }
    end

    describe '::with_tags' do
      it { is_expected.to respond_to(:with_tags) }
      it { expect(Article.with_tags(tag_parent.slug)).to include(@article, other_article) }
      it { expect(Article.with_tags(tag_parent.slug)).not_to include(private_article) }
    end

    describe '::with_parent_tags' do
      it { is_expected.to respond_to(:with_parent_tags) }
      it { expect(Article.with_parent_tags(tag_parent.slug)).to include(@article) }
      it { expect(Article.with_parent_tags(tag_parent.slug)).not_to include(other_article) }
    end

    describe '::with_child_tags' do
      it { is_expected.to respond_to(:with_child_tags) }
      it { expect(Article.with_child_tags(tag_child.slug)).to include(@article) }
      it { expect(Article.with_child_tags(tag_child.slug)).not_to include(other_article) }
    end

    describe '::published' do
      it { is_expected.to respond_to(:published) }
      it { expect(Article.published).to include(@article) }
      it { expect(Article.published).not_to include(other_article) }
    end

    describe '::bookmarked_by_user' do
      it { is_expected.to respond_to(:bookmarked_by_user) }
      it { expect(Article.bookmarked_by_user(@user)).to include(@article) }
      it { expect(Article.bookmarked_by_user(@user)).not_to include(other_article) }
    end

    describe '::search_for' do
      before do
        Article.reindex
        Article.search_index.refresh
      end

      it { is_expected.to respond_to(:search_for) }

      it 'search for articles' do
        article_results = Article.search_for('title')

        expect(article_results[:articles]).not_to be_empty
        expect(article_results[:articles]).to be_kind_of(ActiveRecord::Relation)
        expect(article_results[:articles].size).to eq(2)
        expect(article_results[:articles].map { |article| article[:title] }).to include(@article.title, other_article.title)
      end
    end

    describe '::autocomplete_for' do
      before do
        Article.reindex
        Article.search_index.refresh
      end

      it { is_expected.to respond_to(:autocomplete_for) }

      it 'autocompletes for articles' do
        article_autocompletes = Article.autocomplete_for('tit')

        expect(article_autocompletes).not_to be_empty
        expect(article_autocompletes).to be_a(Array)
        expect(article_autocompletes.size).to eq(2)
        expect(article_autocompletes.map { |article| article[:title] }).to include(@article.title, other_article.title)
      end
    end

    describe '::default_visibility' do
      it { is_expected.to respond_to(:default_visibility) }
      it { expect(Article.default_visibility).to be_kind_of(ActiveRecord::Relation) }
    end

    describe '::filter_by' do
      it { is_expected.to respond_to(:filter_by) }
      it { expect(Article.filter_by(Article.all, {topic_id: @topic.id})).to include(@article) }
    end

    describe '::order_by' do
      it { is_expected.to respond_to(:order_by) }
      it { expect(Article.order_by('id_first')).to be_kind_of(ActiveRecord::Relation) }
    end

    describe '::as_json' do
      it { is_expected.to respond_to(:as_json) }
      it { expect(Article.as_json(@article)).to be_a(Hash) }
      it { expect(Article.as_json(@article)[:article]).to be_a(Hash) }
      it { expect(Article.as_json([@article])).to be_a(Hash) }
      it { expect(Article.as_json([@article])[:articles]).to be_a(Array) }
    end

    describe '::as_flat_json' do
      it { is_expected.to respond_to(:as_flat_json) }
      it { expect(Article.as_flat_json(@article)).to be_a(Hash) }
      it { expect(Article.as_flat_json([@article])).to be_a(Array) }
    end
  end

  context 'Instance Methods' do
    let!(:other_user) { create(:user) }

    let!(:tag_parent) { create(:tag, user: @user, name: 'Tag parent') }
    let!(:tag_child) { create(:tag, user: @user, name: 'Tag children') }

    let(:content) { 'test<p class="secret">secret</p>' }
    let(:content_with_private) { 'test<p class="secret">secret</p>' }

    before do
      @article.tagged_articles.create(user: @user, topic: @topic, tag: tag_parent, parent: true)
      @article.tagged_articles.create(user: @user, topic: @topic, tag: tag_child, child: true)
    end

    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@article.user?(@user)).to be true }
      it { expect(@article.user?(other_user)).to be false }
    end

    describe '.format_attributes' do
      it { is_expected.to respond_to(:format_attributes) }
      it { expect(@article.format_attributes).to be_nil }
      it { expect(@article.format_attributes(@article.attributes)).to be_nil }
    end

    describe '.default_picture' do
      it { is_expected.to respond_to(:default_picture) }
      it { expect(@article.default_picture).to eq('/assets/') }
    end

    describe '.mark_as_outdated' do
      it { is_expected.to respond_to(:mark_as_outdated) }

      it 'marks the article as outdated' do
        expect {
          @article.mark_as_outdated(other_user)
        }.to change(OutdatedArticle, :count).by(1)

        expect(OutdatedArticle.last.user_id).to eq(other_user.id)
        expect(OutdatedArticle.last.article_id).to eq(@article.id)
      end
    end

    describe '.remove_outdated' do
      it { is_expected.to respond_to(:remove_outdated) }

      it 'removes the article from outdated' do
        @article.mark_as_outdated(other_user)

        expect {
          @article.remove_outdated(other_user)
        }.to change(OutdatedArticle, :count).by(-1)
      end
    end

    describe '.bookmarked?' do
      before do
        create(:bookmark, user: other_user, bookmarked: @article, follow: true)
      end

      it { is_expected.to respond_to(:bookmarked?) }
      it { expect(@article.bookmarked?(other_user)).to be true }
      it { expect(@article.bookmarked?(@user)).to be false }
    end

    describe '.followed?' do
      before do
        create(:bookmark, user: other_user, bookmarked: @article)
      end

      it { is_expected.to respond_to(:followed?) }
      it { expect(@article.followed?(other_user)).to be true }
      it { expect(@article.followed?(@user)).to be false }
    end

    describe '.slug_candidates' do
      it { is_expected.to respond_to(:slug_candidates) }
      it { expect(@article.slug_candidates).to be_a(Array) }
    end

    describe '.normalize_friendly_id' do
      it { is_expected.to respond_to(:normalize_friendly_id) }
      it { expect(@article.normalize_friendly_id).to be_a(String) }
    end

    describe '.strip_content' do
      it { is_expected.to respond_to(:strip_content) }
      it { expect(@article.strip_content).to be_a(String) }
    end

    describe '.public_content' do
      it { is_expected.to respond_to(:public_content) }

      it 'removes private content' do
        expect(@article.public_content).to be_a(String)

        @article.update_attribute(:content, content_with_private)
        expect(@article.public_content).to eq('test')
      end
    end

    describe '.private_content?' do
      it { is_expected.to respond_to(:private_content?) }

      it 'checks for private content' do
        expect(@article.private_content?).to be false
        @article.update_attribute(:content, content_with_private)
        expect(@article.private_content?).to be true
      end
    end

    describe '.adapted_content' do
      it { is_expected.to respond_to(:adapted_content) }

      it 'returns the correct content' do
        @article.update_attribute(:content, content_with_private)

        expect(@article.adapted_content(@user.id)).to eq(content_with_private)
        expect(@article.adapted_content(other_user.id)).to eq('test')
      end
    end

    describe '.summary_content' do
      it { is_expected.to respond_to(:summary_content) }
      it { expect(@article.summary_content).to be_a(String) }
    end

    describe '.sanitize_html' do
      it { is_expected.to respond_to(:sanitize_html) }
      it { expect(@article.sanitize_html(content)).to be_a(String) }
    end

    describe '.search_data' do
      it { is_expected.to respond_to(:search_data) }
      it { expect(@article.search_data).to be_a(Hash) }
    end
  end

end
