# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string
#  last_name              :string
#  street                 :string
#  city                   :string
#  postcode               :string
#  state                  :string
#  country                :string
#  mobile_number          :string
#  phone_number           :string
#  additional_info        :string
#  birth_date             :date
#  locale                 :string           default("fr")
#  settings               :jsonb            not null
#  current_topic_id       :integer
#  pictures_count         :integer          default(0)
#  topics_count           :integer          default(0)
#  articles_count         :integer          default(0)
#  tags_count             :integer          default(0)
#  bookmarks_count        :integer          default(0)
#  slug                   :string
#  deleted_at             :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#

RSpec.describe User, type: :model do

  before do
    @user = User.create(
      pseudo:                'User',
      email:                 'user@example.com',
      password:              'foobarfoo',
      password_confirmation: 'foobarfoo',
      first_name:            'Example',
      last_name:             'User',
      city:                  'My city',
      country:               'My country',
      additional_info:       'My personal info',
      locale:                'fr',
      # birth_date:            Chronic.parse('yesterday 12:00'),
      street:                'street',
      postcode:              '33000',
      state:                 'state',
      mobile_number:         '0606060606',
      phone_number:          '0101010101',
      slug:                  'example_user'
    )
    @user.confirm
  end

  subject { @user }

  context 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Attributes', basic: true do
    it { is_expected.to respond_to(:pseudo) }
    it { is_expected.to respond_to(:email) }
    it { is_expected.to respond_to(:first_name) }
    it { is_expected.to respond_to(:last_name) }
    it { is_expected.to respond_to(:city) }
    it { is_expected.to respond_to(:country) }
    it { is_expected.to respond_to(:phone_number) }
    it { is_expected.to respond_to(:additional_info) }
    it { is_expected.to respond_to(:locale) }
    it { is_expected.to respond_to(:settings) }
    it { is_expected.to respond_to(:birth_date) }
    it { is_expected.to respond_to(:street) }
    it { is_expected.to respond_to(:postcode) }
    it { is_expected.to respond_to(:state) }
    it { is_expected.to respond_to(:mobile_number) }
    it { is_expected.to respond_to(:postcode) }
    it { is_expected.to respond_to(:pictures_count) }
    it { is_expected.to respond_to(:topics_count) }
    it { is_expected.to respond_to(:articles_count) }
    it { is_expected.to respond_to(:tags_count) }
    it { is_expected.to respond_to(:bookmarks_count) }
    it { is_expected.to respond_to(:comments_count) }
    # it { is_expected.to respond_to(:external) }

    it { expect(@user.pseudo).to eq('User') }
    # it { expect(@user.email).to eq('user@example.com') }
    it { expect(@user.password).to eq('foobarfoo') }
    it { expect(@user.first_name).to eq('Example') }
    it { expect(@user.last_name).to eq('User') }
    it { expect(@user.city).to eq('My city') }
    it { expect(@user.country).to eq('My country') }
    it { expect(@user.mobile_number).to eq('0606060606') }
    it { expect(@user.phone_number).to eq('0101010101') }
    it { expect(@user.additional_info).to eq('My personal info') }
    it { expect(@user.locale).to eq('fr') }
    it { expect(@user.street).to eq('street') }
    it { expect(@user.postcode).to eq('33000') }
    it { expect(@user.state).to eq('state') }
    it { expect(@user.settings).to eq({ 'article_display' => 'card', 'search_highlight' => true, 'search_operator' => 'and', 'search_exact' => true }) }
    it { expect(@user.pictures_count).to eq(0) }
    it { expect(@user.topics_count).to eq(1) }
    it { expect(@user.articles_count).to eq(0) }
    it { expect(@user.tags_count).to eq(0) }
    it { expect(@user.bookmarks_count).to eq(0) }
    it { expect(@user.comments_count).to eq(0) }
    # it { expect(@user.external).to be false }

    describe 'Default Attributes', basic: true do
      before do
        @user = User.create(
          pseudo:                'User',
          email:                 'user@example.com',
          password:              'foobarfoo',
          password_confirmation: 'foobarfoo',
          slug:                  'example_user'
        )
      end

      it { expect(@user.locale).to eq('fr') }
      it { expect(@user.settings).to eq({ 'article_display' => 'card', 'search_highlight' => true, 'search_operator' => 'and', 'search_exact' => true }) }
      it { expect(@user.pictures_count).to eq(0) }
      it { expect(@user.topics_count).to eq(0) }
      it { expect(@user.articles_count).to eq(0) }
      it { expect(@user.tags_count).to eq(0) }
      it { expect(@user.bookmarks_count).to eq(0) }
    end

    describe '#pseudo' do
      it { is_expected.to validate_presence_of(:pseudo) }
      it { is_expected.to validate_length_of(:pseudo).is_at_least(CONFIG.user_pseudo_min_length) }
      it { is_expected.to validate_length_of(:pseudo).is_at_most(CONFIG.user_pseudo_max_length) }
      it { is_expected.to validate_uniqueness_of(:pseudo).case_insensitive }
      it { is_expected.to have_db_index(:pseudo) }
    end

    describe '#email' do
      it { is_expected.to validate_presence_of(:email) }
      it { is_expected.to validate_length_of(:email).is_at_least(CONFIG.user_email_min_length) }
      it { is_expected.to validate_length_of(:email).is_at_most(CONFIG.user_email_max_length) }
      it { is_expected.to validate_uniqueness_of(:email).case_insensitive }

      it 'should accept valid addresses' do
        valid_addresses = %w[user@example.com USER@foo.COM A_US-ER@foo.bar.org first.last@foo.jp alice+bob@baz.cn]
        valid_addresses.each do |valid_address|
          @user.email = valid_address
          expect(@user).to be_valid
        end
      end

      it 'should reject invalid addresses' do
        invalid_addresses = %w[user@example,com user_at_foo.org user.name@example.]
        invalid_addresses.each do |invalid_address|
          @user.email = invalid_address
          expect(@user).not_to be_valid
        end
      end
    end

    describe '#password' do
      it { is_expected.to respond_to(:password) }
      it { is_expected.to validate_presence_of(:password) }
      it { is_expected.to validate_length_of(:password).is_at_least(CONFIG.user_password_min_length) }
      it { is_expected.to validate_length_of(:password).is_at_most(CONFIG.user_password_max_length) }

      describe 'when password does not match confirmation' do
        before do
          @user.password_confirmation = 'mismatch'
        end

        it { is_expected.not_to be_valid }
      end
    end

    describe '#login' do
      it { is_expected.to respond_to(:login) }
    end

    # describe '#settings' do
    #   it { is_expected.to serialize(:settings) }
    # end
  end

  context 'Properties', basic: true do
    it { is_expected.to callback(:create_default_topic).after(:create) }

    it { is_expected.to have_friendly_id(:slug) }

    it { is_expected.to act_as_tracked(User) }

    it { is_expected.to have_strip_attributes([:first_name, :last_name, :city, :country, :additional_info, :phone_number, :mobile_number]) }

    it { is_expected.to act_as_paranoid(User) }

    it 'uses counter cache for pictures' do
      picture = create(:picture, user: @user, imageable_type: 'User')
      expect {
        @user.pictures << picture
      }.to change(@user.reload, :pictures_count).by(1)
    end

    it 'uses counter cache for bookmarks' do
      bookmark = create(:bookmark, user: @user, bookmarked: @user)
      expect {
        @user.bookmarks << bookmark
      }.to change(@user.reload, :bookmarks_count).by(1)
    end

    it 'uses counter cache for topics' do
      expect {
        create(:topic, user: @user)
      }.to change(@user.reload, :topics_count).by(1)
    end

    it 'uses counter cache for articles' do
      expect {
        create(:article, user: @user, topic: create(:topic, user: @user))
      }.to change(@user.reload, :articles_count).by(1)
    end

    it 'uses counter cache for tags' do
      expect {
        create(:tag, user: @user)
      }.to change(@user.reload, :tags_count).by(1)
    end

    it 'uses counter cache for comments' do
      expect {
        create(:comment, user: @user, commentable: @user)
      }.to change(@user.reload, :comments_count).by(1)
    end
  end

  context 'Associations', basic: true do
    it { is_expected.to have_many(:topics) }

    it { is_expected.to have_many(:articles) }
    it { is_expected.to have_many(:draft_articles) }
    it { is_expected.to have_many(:article_relationships) }
    it { is_expected.to have_many(:outdated_articles) }

    it { is_expected.to have_many(:tags) }
    it { is_expected.to have_many(:tag_relationships) }

    it { is_expected.to have_many(:bookmarks) }
    it { is_expected.to have_many(:followers) }
    it { is_expected.to have_many(:following_users) }
    it { is_expected.to have_many(:following_articles) }
    it { is_expected.to have_many(:following_tags) }

    it { is_expected.to have_many(:comments) }

    it { is_expected.to have_many(:pictures) }

    it { is_expected.to have_one(:picture) }
    it { is_expected.to accept_nested_attributes_for(:picture) }
  end

  context 'Public Methods', basic: true do
    subject { User }

    let!(:other_user) { create(:user) }

    before do
      @user.bookmarks << create(:bookmark, user: @user, bookmarked: other_user)

      User.reindex
      User.search_index.refresh
    end

    describe '::bookmarked_by_user' do
      it { is_expected.to respond_to(:bookmarked_by_user) }
      it { expect(User.bookmarked_by_user(@user)).to include(@user) }
      it { expect(User.bookmarked_by_user(@user)).not_to include(other_user) }
    end

    describe '::search_for' do
      it { is_expected.to respond_to(:search_for) }

      it 'search for users' do
        user_results = User.search_for('user')
        expect(user_results[:users]).not_to be_empty
        expect(user_results[:users]).to be_a(Array)
        expect(user_results[:users].size).to eq(1)
        expect(user_results[:users].map { |user| user[:pseudo] }).to include(@user.pseudo)
      end
    end

    describe '::autocomplete_for' do
      it { is_expected.to respond_to(:autocomplete_for) }

      it 'autocompletes for users' do
        user_autocompletes = User.autocomplete_for('us')

        expect(user_autocompletes).not_to be_empty
        expect(user_autocompletes).to be_a(Array)
        expect(user_autocompletes.size).to eq(1)
        expect(user_autocompletes.map { |user| user[:pseudo] }).to include(@user.pseudo)
      end
    end

    describe '::order_by' do
      it { is_expected.to respond_to(:order_by) }
      it { expect(User.order_by('id_first')).to be_kind_of(ActiveRecord::Relation) }
    end

    describe '::pseudo?' do
      it { is_expected.to respond_to(:pseudo?) }
      it { expect(User.pseudo?('User')).to be true }
    end

    describe '::email?' do
      it { is_expected.to respond_to(:email?) }
      it { expect(User.email?('user@example.com')).to be true }
    end

    describe '::login?' do
      it { is_expected.to respond_to(:login?) }
      it { expect(User.login?('User')).to be true }
      it { expect(User.login?('user@example.com')).to be true }
    end

    describe '::find_for_database_authentication' do
      it { is_expected.to respond_to(:find_for_database_authentication) }
    end

    describe '::as_json' do
      it { is_expected.to respond_to(:as_json) }
      it { expect(User.as_json(@user)).to be_a(Hash) }
      it { expect(User.as_json(@user)[:user]).to be_a(Hash) }
      it { expect(User.as_json([@user])).to be_a(Hash) }
      it { expect(User.as_json([@user])[:users]).to be_a(Array) }
    end

    describe '::as_flat_json' do
      it { is_expected.to respond_to(:as_flat_json) }
      it { expect(User.as_flat_json(@user)).to be_a(Hash) }
      it { expect(User.as_flat_json([@user])).to be_a(Array) }
    end
  end

  context 'Instance Methods', basic: true do
    let!(:other_user) { create(:user) }

    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@user.user?(@user)).to be true }
      it { expect(@user.user?(other_user)).to be false }
    end

    describe '.avatar' do
      it { is_expected.to respond_to(:avatar) }
      it { expect(@user.avatar).to be_nil }
    end

    describe '.current_topic' do
      it { is_expected.to respond_to(:current_topic) }
      it { expect(@user.current_topic).to eq(Topic.where(user_id: @user.id).first) }
    end

    describe '.switch_topic' do
      it { is_expected.to respond_to(:switch_topic) }

      it 'switches topic' do
        topic = create(:topic, user: @user)
        other_topic = create(:topic, user: other_user)

        expect(@user.switch_topic(topic)).to eq(topic)

        expect(@user.switch_topic(topic)).to be false
        expect(@user.errors[:topic].first).to eq(I18n.t('activerecord.errors.models.topic.already_selected'))

        expect(@user.switch_topic(other_topic)).to be false
        expect(@user.errors[:topic].second).to eq(I18n.t('activerecord.errors.models.topic.not_owner'))
      end
    end

    describe '.bookmarkers_count' do
      before do
        topic = create(:topic, user: other_user)
        tag = create(:tag, user: other_user)
        article = create(:article, user: other_user, topic: topic)
        create(:bookmark, user: @user, bookmarked: other_user)
        create(:bookmark, user: @user, bookmarked: tag)
        create(:bookmark, user: @user, bookmarked: article)
      end

      it { is_expected.to respond_to(:bookmarkers_count) }
      it { expect(@user.bookmarkers_count).to eq(3) }
    end

    describe '.following?' do
      it { is_expected.to respond_to(:following?) }

      it 'confirms if follow' do
        topic = create(:topic, user: other_user)
        tag = create(:tag, user: other_user)
        article = create(:article, user: other_user, topic: topic)
        create(:bookmark, user: @user, bookmarked: other_user)
        create(:bookmark, user: @user, bookmarked: tag)
        create(:bookmark, user: @user, bookmarked: article)

        expect(@user.following?('User', other_user.id)).to be true
        expect(@user.following?('Tag', tag.id)).to be true
        expect(@user.following?('Article', article.id)).to be true
        expect(@user.following?('Topic', topic.id)).to be false
      end
    end

    describe '.search_data' do
      it { is_expected.to respond_to(:search_data) }
      it { expect(@user.search_data).to be_a Hash }
    end
  end

end
