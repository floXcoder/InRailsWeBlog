# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string           default("")
#  last_name              :string           default("")
#  age                    :integer          default(0)
#  city                   :string           default("")
#  country                :string           default("")
#  additional_info        :string           default("")
#  locale                 :string           default("fr")
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
#

RSpec.describe User, type: :model do

  before do
    @user = User.create(
        pseudo: 'User',
        email: 'user@example.com',
        password: 'foobarfoo',
        password_confirmation: 'foobarfoo',
        first_name: 'Example',
        last_name: 'User',
        age: 30,
        city: 'My city',
        country: 'My country',
        additional_info: 'My personal info',
        slug: 'example_user',
        locale: 'fr'
    )
  end

  subject { @user }

  describe 'User model', basic: true do
    it { is_expected.to be_valid }
  end

  describe '#pseudo', basic: true do
    it { is_expected.to respond_to(:pseudo) }
    it { is_expected.to validate_presence_of(:pseudo) }
    it { is_expected.to validate_length_of(:pseudo).is_at_most(50) }
    it { is_expected.to validate_uniqueness_of(:pseudo).case_insensitive }
    it { expect(@user.pseudo).to match 'User' }
  end

  describe '#email', basic: true do
    it { is_expected.to respond_to(:email) }
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_length_of(:email).is_at_most(128) }
    it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
    it { expect(@user.email).to match 'user@example.com' }

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

  describe '#password', basic: true do
    it { is_expected.to respond_to(:password) }
    it { is_expected.to validate_presence_of(:password) }
    it { is_expected.to validate_length_of(:password).is_at_least(8) }
    it { is_expected.to validate_length_of(:password).is_at_most(128) }
    it { expect(@user.password).to match 'foobarfoo' }

    describe 'when password doesn\'t match confirmation' do
      before do
        @user.password_confirmation = 'mismatch'
      end

      it { is_expected.not_to be_valid }
    end
  end

  describe '#slug', basic: true do
    it { is_expected.to respond_to(:slug) }
    it { is_expected.to validate_uniqueness_of(:slug).case_insensitive }
    it { is_expected.to have_db_index(:slug) }
    it { expect(@user.slug).to match 'example_user' }
  end

  describe '#locale', basic: true do
    it { is_expected.to respond_to(:locale) }
    it { expect(@user.locale).to match 'fr' }
  end

  describe '#login', basic: true do
    it { is_expected.to respond_to(:login) }
  end

  describe 'personal informations', basic: true do
    it { is_expected.to respond_to(:first_name) }
    it { expect(@user.first_name).to match 'Example' }
    it { is_expected.to respond_to(:last_name) }
    it { expect(@user.last_name).to match 'User' }
    it { is_expected.to respond_to(:age) }
    it { expect(@user.age).to eq(30) }
    it { is_expected.to respond_to(:city) }
    it { expect(@user.city).to match 'My city' }
    it { is_expected.to respond_to(:country) }
    it { expect(@user.country).to match 'My country' }
    it { is_expected.to respond_to(:additional_info) }
    it { expect(@user.additional_info).to match 'My personal info' }
  end

  # describe 'enums', basic: true do
  # end

  context 'associations' do
    describe 'relations', basic: true do
      # it { is_expected.to have_many(:comments) }

      it { is_expected.to have_one(:picture) }
      it { is_expected.to accept_nested_attributes_for(:picture) }
    end
  end

  # context 'methods' do
  #   describe '.pseudo?', basic: true do
  #     it { expect(User.pseudo?(@user).additional_info).to be_valid }
  #   end
  #
  #   describe '.email?', basic: true do
  #     it { expect(User.email?(@user).additional_info).to be_valid }
  #   end
  #
  #   describe '.login?', basic: true do
  #     it { expect(User.login?(@user).additional_info).to be_valid }
  #   end
  # end

end
