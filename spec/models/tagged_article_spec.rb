# == Schema Information
#
# Table name: tagged_articles
#
#  id         :integer          not null, primary key
#  article_id :integer          not null
#  tag_id     :integer          not null
#  parent     :boolean          default(FALSE), not null
#  child      :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

RSpec.describe TaggedArticle, type: :model do

  before(:all) do
    @user    = create(:user)
    @topic   = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)
    @tag     = create(:tag, tagger: @user)
  end

  before do
    @tagged_article = TaggedArticle.create(
      article: @article,
      tag:     @tag
    )
  end

  subject { @tagged_article }

  context 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Properties', basic: true do
    it { is_expected.to have_activity }
  end

  context 'Associations', basic: true do
    it { is_expected.to belong_to(:article) }
    it { is_expected.to belong_to(:tag) }

    it { is_expected.to validate_presence_of(:article) }
    it { is_expected.to validate_presence_of(:tag) }

    it { is_expected.to validate_uniqueness_of(:article_id).scoped_to(:tag_id) }
  end

end
