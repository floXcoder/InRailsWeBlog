# == Schema Information
#
# Table name: articles
#
#  id              :integer          not null, primary key
#  author_id       :integer          not null
#  visibility      :integer          default(0), not null
#  notation        :integer          default(0)
#  priority        :integer          default(0)
#  allow_comment   :boolean          default(FALSE), not null
#  private_content :boolean          default(FALSE), not null
#  is_link         :boolean          default(FALSE), not null
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

RSpec.describe Article, type: :model do

  let(:user) { create(:user, :confirmed) }

  before do
    @article = Article.create(
        author: user,
        title: 'My title',
        summary: 'Summary of my article',
        content: 'Content of my article',
        visibility: 'everyone',
        notation: 1,
        priority: 1,
        allow_comment: false
    )
  end

  subject { @article }

  describe 'Article model', basic: true do
    it { is_expected.to be_valid }
  end

  describe '#author_id', basic: true do
    it { is_expected.to respond_to(:author_id) }
    it { is_expected.to validate_presence_of(:author_id) }
    it { is_expected.to have_db_index(:author_id) }
    it { expect(@article.author_id).to eq(user.id) }
  end

  describe '#title', basic: true do
    it { is_expected.to respond_to(:title) }
    it { is_expected.to validate_length_of(:title).is_at_most(128) }
    it { expect(@article.title).to match 'My title' }
  end

  describe '#summary', basic: true do
    it { is_expected.to respond_to(:summary) }
    it { is_expected.to validate_length_of(:summary).is_at_most(256) }
    it { expect(@article.summary).to match 'Summary of my article' }
  end

  describe '#content', basic: true do
    it { is_expected.to respond_to(:content) }
    it { is_expected.to validate_length_of(:content).is_at_most(12_000) }
    it { is_expected.to validate_presence_of(:content) }
    it { expect(@article.content).to match 'Content of my article' }
  end

  describe '#visibility', basic: true do
    it { is_expected.to define_enum_for(:visibility) }
    it { is_expected.to respond_to(:visibility_to_tr) }
    it { expect(@article.visibility).to eq('everyone') }
  end

  describe '#notation', basic: true do
    it { is_expected.to respond_to(:notation) }
    it { expect(@article.notation).to eq(1) }
  end

  describe '#priority', basic: true do
    it { is_expected.to respond_to(:priority) }
    it { expect(@article.priority).to eq(1) }
  end

  describe '#allow_comment', basic: true do
    it { is_expected.to respond_to(:allow_comment) }
    it { expect(@article.allow_comment).to be false }
  end

  describe '#slug', basic: true do
    it { is_expected.to respond_to(:slug) }
    it { is_expected.to validate_uniqueness_of(:slug).case_insensitive }
    it { is_expected.to have_db_index(:slug) }
    it 'returns a string' do
      expect(@article.slug).to match 'my-title'
    end
  end

  context 'translations' do
    describe 'translates title, summary and content attributes', basic: true do
      it { is_expected.to transcribe(:title, [:en, :fr]) }
      it { is_expected.to fallback(:title, :en, :fr) }
      it { is_expected.to transcribe(:summary, [:en, :fr]) }
      it { is_expected.to fallback(:summary, :en, :fr) }
      it { is_expected.to transcribe(:content, [:en, :fr]) }
      it { is_expected.to fallback(:content, :en, :fr) }
    end
  end

  context 'associations' do
    describe 'relations', basic: true do
      # it { is_expected.to have_many(:comments) }

      it { is_expected.to have_and_belong_to_many(:tags) }
      it { is_expected.to have_many(:picture) }
      it { is_expected.to accept_nested_attributes_for(:picture) }
    end
  end

end
