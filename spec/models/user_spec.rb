# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string           default("")
#  last_name              :string           default("")
#  city                   :string           default("")
#  country                :string           default("")
#  phone_number           :string           default("")
#  additional_info        :string           default("")
#  locale                 :string           default("fr")
#  preferences            :text             default({})
#  deleted_at             :datetime
#  slug                   :string
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
#  pictures_count         :integer          default(0), not null
#  external               :boolean          default(FALSE), not null
#  professional           :boolean          default(FALSE), not null
#  professional_type      :string           default("0"), not null
#  birth_date             :date
#  street                 :string
#  postcode               :string
#  state                  :string
#  mobile_number          :string
#  company_name           :string
#  registered_number      :string
#

require 'rails_helper'

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
      birth_date:            Chronic.parse('yesterday 12:00'),
      street:                'street',
      postcode:              '33000',
      state:                 'state',
      mobile_number:         '0606060606',
      phone_number:          '0101010101',
      preferences:           {},
      pictures_count:        0,
      external:              false,
      professional:          true,
      professional_type:     'individual',
      company_name:          'My company',
      registered_number:     '111 222 333 44444',
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
    it { is_expected.to respond_to(:preferences) }
    it { is_expected.to respond_to(:pictures_count) }
    it { is_expected.to respond_to(:external) }
    it { is_expected.to respond_to(:professional) }
    it { is_expected.to respond_to(:professional_type) }
    it { is_expected.to respond_to(:birth_date) }
    it { is_expected.to respond_to(:street) }
    it { is_expected.to respond_to(:postcode) }
    it { is_expected.to respond_to(:state) }
    it { is_expected.to respond_to(:mobile_number) }
    it { is_expected.to respond_to(:postcode) }
    it { is_expected.to respond_to(:company_name) }
    it { is_expected.to respond_to(:registered_number) }

    it { expect(@user.pseudo).to eq('User') }
    # it { expect(@user.email).to eq('user@example.com') }
    it { expect(@user.password).to eq('foobarfoo') }
    it { expect(@user.first_name).to eq('Example') }
    it { expect(@user.last_name).to eq('User') }
    it { expect(@user.city).to eq('My city') }
    it { expect(@user.country).to eq('My country') }
    # it { expect(@user.birth_date).to eq(DateTime(Chronic.parse('yesterday 12:00'))) }
    it { expect(@user.mobile_number).to eq('0606060606') }
    it { expect(@user.phone_number).to eq('0101010101') }
    it { expect(@user.additional_info).to eq('My personal info') }
    it { expect(@user.locale).to eq('fr') }
    it { expect(@user.street).to eq('street') }
    it { expect(@user.postcode).to eq('33000') }
    it { expect(@user.state).to eq('state') }
    it { expect(@user.preferences).to eq({}) }
    it { expect(@user.pictures_count).to eq(0) }
    it { expect(@user.external).to be false }
    it { expect(@user.professional).to be true }
    it { expect(@user.professional_type).to eq('individual') }
    it { expect(@user.company_name).to eq('My company') }
    it { expect(@user.registered_number).to eq('111 222 333 44444') }

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

      # it { expect(@user.first_name).to eq('') }
      # it { expect(@user.last_name).to eq('') }
      # it { expect(@user.additional_info).to eq('') }
      it { expect(@user.locale).to eq('fr') }
      it { expect(@user.preferences).to eq({}) }
      it { expect(@user.pictures_count).to eq(0) }
      it { expect(@user.external).to be false }
      it { expect(@user.professional).to be false }
      it { expect(@user.professional_type).to eq('individual') }
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

    # describe '#preferences' do
    #   it { is_expected.to serialize(:preferences) }
    # end

    # describe 'professional user' do
    #   it { is_expected.to validate_presence_of(:professional_type) }
    #   it { is_expected.to validate_presence_of(:first_name) }
    #   it { is_expected.to validate_presence_of(:last_name) }
    #   it { is_expected.to validate_presence_of(:street) }
    #   it { is_expected.to validate_presence_of(:postcode) }
    #   it { is_expected.to validate_presence_of(:city) }
    #   it { is_expected.to validate_presence_of(:country) }
    #   it { is_expected.to validate_presence_of(:phone_number) }
    #   it { is_expected.to validate_presence_of(:mobile_number) }
    #   it { is_expected.to validate_presence_of(:company_name) }
    #   it { is_expected.to validate_presence_of(:registered_number) }
    # end
  end

  context 'Properties', basic: true do
    it { is_expected.to callback(:set_preferences).before(:create) }
    it { is_expected.to callback(:create_default_topic).after(:create) }

    it { is_expected.to have_friendly_id(:slug) }

    it { is_expected.to act_as_tracked(User) }

    it { is_expected.to act_as_paranoid(User) }

    it { is_expected.to have_strip_attributes([:first_name, :last_name, :city, :country, :additional_info, :phone_number, :mobile_number, :company_name, :registered_number]) }
  end

  context 'Associations', basic: true do
    it { is_expected.to have_many(:topics) }

    it { is_expected.to have_many(:articles) }
    it { is_expected.to have_many(:temporary_articles) }

    it { is_expected.to have_many(:bookmarked_articles) }
    it { is_expected.to have_many(:bookmarks) }

    it { is_expected.to have_many(:outdated_articles) }
    it { is_expected.to have_one(:marked_as_outdated) }

    it { is_expected.to have_many(:comments) }

    it { is_expected.to have_many(:activities) }

    it { is_expected.to have_one(:picture) }
    it { is_expected.to accept_nested_attributes_for(:picture) }
  end

  context 'Public Methods', basic: true do
    subject { User }

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

    # describe '::as_json' do
    #   it { is_expected.to respond_to(:as_json) }
    #   it { expect(User.as_json(@user)).to be_a(Hash) }
    #   it { expect(User.as_json(@user)[:user]).to be_a(Hash) }
    #   it { expect(User.as_json([@user])).to be_a(Hash) }
    #   it { expect(User.as_json([@user])[:users]).to be_a(Array) }
    # end
    #
    # describe '::as_flat_json' do
    #   it { is_expected.to respond_to(:as_flat_json) }
    #   it { expect(User.as_flat_json(@user)).to be_a(Hash) }
    #   it { expect(User.as_flat_json([@user])).to be_a(Array) }
    # end
  end

  context 'Instance Methods', basic: true do
    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@user.user?(@user)).to be true }
      it { expect(@user.user?(create(:user))).to be false }
    end

    describe '.avatar' do
      it { is_expected.to respond_to(:avatar) }
    end

    describe '.current_topic' do
      it { is_expected.to respond_to(:current_topic) }
    end

    describe '.change_current_topic' do
      it { is_expected.to respond_to(:change_current_topic) }
    end
  end

end
