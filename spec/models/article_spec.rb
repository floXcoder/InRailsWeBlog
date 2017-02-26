# == Schema Information
#
# Table name: articles
#
#  id                        :integer          not null, primary key
#  author_id                 :integer          not null
#  topic_id                  :integer          not null
#  title                     :string           default("")
#  summary                   :text             default("")
#  content                   :text             default(""), not null
#  private_content           :boolean          default(FALSE), not null
#  is_link                   :boolean          default(FALSE), not null
#  reference                 :text
#  draft                 :boolean          default(FALSE), not null
#  language                  :string
#  allow_comment             :boolean          default(TRUE), not null
#  notation                  :integer          default(0)
#  priority                  :integer          default(0)
#  visibility                :integer          default(0), not null
#  archived                  :boolean          default(FALSE), not null
#  accepted                  :boolean          default(TRUE), not null
#  bookmarked_articles_count :integer          default(0)
#  outdated_articles_count   :integer          default(0)
#  slug                      :string
#  deleted_at                :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#

RSpec.describe Article, type: :model do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)
  end

  before do
    @article = Article.create(
      user:                    @user,
      topic:                     @topic,
      title:                     'My title',
      summary:                   'Summary of my article',
      content:                   'Content of my article',
      reference:                 'Reference link',
      language:                  'fr',
      visibility:                'everyone',
      notation:                  1,
      priority:                  1,
      draft:                 false,
      allow_comment:             false,
      archived:                  false,
      accepted:                  true,
      bookmarked_articles_count: 0,
      outdated_articles_count:   0
    )
  end

  subject { @article }

  describe 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Attributes', basic: true do
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
    it { is_expected.to respond_to(:bookmarked_articles_count) }
    it { is_expected.to respond_to(:outdated_articles_count) }

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
    it { expect(@article.accepted).to be false }
    it { expect(@article.bookmarked_articles_count).to eq(0) }
    it { expect(@article.outdated_articles_count).to eq(0) }

    describe 'Default Attributes', basic: true do
      before do
        @article = Article.create(
          user:  @user,
          content: 'Content of my article'
        )
      end

      it { expect(@article.title).to eq('') }
      it { expect(@article.summary).to eq('') }
      it { expect(@article.notation).to eq(1) }
      it { expect(@article.priority).to eq(1) }
      it { expect(@article.visibility).to eq('everyone') }
      it { expect(@article.draft).to be false }
      it { expect(@article.allow_comment).to be false }
      it { expect(@article.archived).to be false }
      it { expect(@article.accepted).to be true }
      it { expect(@article.bookmarked_articles_count).to eq(0) }
      it { expect(@article.outdated_articles_count).to eq(0) }
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
  end

  context 'Properties', basic: true do
    it { is_expected.to callback(:sanitize_html).before(:save) }

    it { is_expected.to have_friendly_id(:slug) }

    it { is_expected.to act_as_tracked(Article) }

    it { is_expected.to have_activity }

    it { is_expected.to acts_as_commentable(Article) }

    it { is_expected.to have_strip_attributes([:title, :summary]) }

    it { is_expected.to acts_as_voteable(Article) }

    it { is_expected.to have_paper_trail(Article) }

    it { is_expected.to have_searh(Article) }
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to have_db_index(:user_id) }

    it { is_expected.to belong_to(:topic) }

    it { is_expected.to have_many(:tagged_articles) }
    it { is_expected.to have_many(:tags) }
    it { is_expected.to have_many(:parent_tags) }
    it { is_expected.to have_many(:child_tags) }

    it { is_expected.to have_many(:bookmarked_articles) }
    it { is_expected.to have_many(:user_bookmarks) }

    it { is_expected.to have_many(:outdated_articles) }
    it { is_expected.to have_many(:marked_as_outdated) }

    it { is_expected.to have_many(:pictures) }
    it { is_expected.to accept_nested_attributes_for(:pictures) }
  end

  context 'Public Methods', basic: true do
    subject { Article }

    let!(:private_article) { create(:article, user: @user, visibility: 'only_me') }

    let!(:other_user) { create(:user) }
    let!(:other_article) { create(:article, user: other_user) }

    describe '::user_related' do
      it { is_expected.to respond_to(:user_related) }
    end

    describe '::published' do
      it { is_expected.to respond_to(:published) }
    end

    describe '::with_tags' do
      it { is_expected.to respond_to(:with_tags) }
    end

    describe '::with_parent_tags' do
      it { is_expected.to respond_to(:with_parent_tags) }
    end

    describe '::with_child_tags' do
      it { is_expected.to respond_to(:with_child_tags) }
    end

    # describe '::with_visibility' do
    #   it { is_expected.to respond_to(:with_visibility) }
    #   it { expect(Shop.with_visibility('only_me')).to include(private_shop) }
    #   it { expect(Shop.with_visibility(1)).to include(private_shop) }
    #   it { expect(Shop.with_visibility(1)).not_to include(@shop) }
    # end
    #
    # describe '::everyone_and_user' do
    #   it { is_expected.to respond_to(:everyone_and_user) }
    #   it { expect(Shop.everyone_and_user).to include(@shop, shop_from_other_user) }
    #   it { expect(Shop.everyone_and_user(@user.id)).to include(@shop, private_shop, shop_from_other_user) }
    # end
    #
    # describe '::from_user' do
    #   it { is_expected.to respond_to(:from_user) }
    #   it { expect(Shop.from_user).to match_array([]) }
    #   it { expect(Shop.from_user(@user.id)).to match_array([@shop]) }
    #   it { expect(Shop.from_user(@user.id, @user.id)).to match_array([@shop, private_shop]) }
    # end

    describe '::search_for' do
      it { is_expected.to respond_to(:search_for) }
    end

    describe '::autocomplete_for' do
      it { is_expected.to respond_to(:autocomplete_for) }
    end

    # describe '::as_json' do
    #   it { is_expected.to respond_to(:as_json) }
    #   it { expect(Shop.as_json(@shop)).to be_a(Hash) }
    #   it { expect(Shop.as_json(@shop)[:shop]).to be_a(Hash) }
    #   it { expect(Shop.as_json([@shop])).to be_a(Hash) }
    #   it { expect(Shop.as_json([@shop])[:shops]).to be_a(Array) }
    # end
    #
    # describe '::as_flat_json' do
    #   it { is_expected.to respond_to(:as_flat_json) }
    #   it { expect(Shop.as_flat_json(@shop)).to be_a(Hash) }
    #   it { expect(Shop.as_flat_json([@shop])).to be_a(Array) }
    # end
  end

  context 'Instance Methods', basic: true do
    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@article.user?(@user)).to be true }
      it { expect(@article.user?(create(:user))).to be false }
    end

    describe '.format_attributes' do
      it { is_expected.to respond_to(:format_attributes) }
    end

    describe '.default_picture' do
      it { is_expected.to respond_to(:default_picture) }
    end

    describe '.create_tag_relationships' do
      it { is_expected.to respond_to(:create_tag_relationships) }
    end

    describe '.update_tag_relationships' do
      it { is_expected.to respond_to(:update_tag_relationships) }
    end

    describe '.delete_tag_relationships' do
      it { is_expected.to respond_to(:delete_tag_relationships) }
    end

    describe '.tags_to_topic' do
      it { is_expected.to respond_to(:tags_to_topic) }
    end

    describe '.add_bookmark' do
      it { is_expected.to respond_to(:add_bookmark) }
    end

    describe '.remove_bookmark' do
      it { is_expected.to respond_to(:remove_bookmark) }
    end

    describe '.mark_as_outdated' do
      it { is_expected.to respond_to(:mark_as_outdated) }
    end

    describe '.remove_outdated' do
      it { is_expected.to respond_to(:remove_outdated) }
    end

    describe '.normalize_friendly_id' do
      it { is_expected.to respond_to(:normalize_friendly_id) }
    end

    describe '.strip_content' do
      it { is_expected.to respond_to(:strip_content) }
    end

    describe '.public_content' do
      it { is_expected.to respond_to(:public_content) }
    end

    describe '.has_private_content?' do
      it { is_expected.to respond_to(:has_private_content?) }
    end

    describe '.adapted_content' do
      it { is_expected.to respond_to(:adapted_content) }
    end

    describe '.summary_content' do
      it { is_expected.to respond_to(:summary_content) }
    end

    describe '.sanitize_html' do
      it { is_expected.to respond_to(:sanitize_html) }
    end
  end

end
