# == Schema Information
#
# Table name: admins
#
#  id                     :integer          not null, primary key
#  pseudo                 :string           default(""), not null
#  additional_info        :string
#  locale                 :string           default("fr")
#  settings               :jsonb            not null
#  slug                   :string
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
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

RSpec.describe Admin, type: :model do

  before do
    @admin = Admin.create(
      pseudo:                'Admin',
      email:                 'admin@example.com',
      password:              'foobarfoo',
      password_confirmation: 'foobarfoo',
      additional_info:       'My personal info',
      settings:              {},
      slug:                  'example_admin',
      locale:                'fr'
    )
  end

  subject { @admin }

  describe 'Object', basic: true do
    it { is_expected.to be_valid }
  end

  context 'Attributes', basic: true do
    it { is_expected.to respond_to(:pseudo) }
    it { is_expected.to respond_to(:email) }
    it { is_expected.to respond_to(:additional_info) }
    it { is_expected.to respond_to(:locale) }
    it { is_expected.to respond_to(:settings) }

    it { expect(@admin.additional_info).to eq('My personal info') }
    it { expect(@admin.locale).to eq('fr') }
    it { expect(@admin.settings).to eq({}) }
    it { expect(@admin.slug).to eq('example_admin') }

    describe 'Default Attributes' do
      before do
        @admin = Admin.create(
          pseudo: 'Admin'
        )
      end

      it { expect(@admin.locale).to eq('fr') }
      it { expect(@admin.settings).to eq('{}') }
    end

    describe '#pseudo' do
      it { is_expected.to validate_presence_of(:pseudo) }
      it { is_expected.to validate_length_of(:pseudo).is_at_least(CONFIG.user_pseudo_min_length) }
      it { is_expected.to validate_length_of(:pseudo).is_at_most(CONFIG.user_pseudo_max_length) }
      it { is_expected.to validate_uniqueness_of(:pseudo).case_insensitive }
      it { expect(@admin.pseudo).to eq('Admin') }
      it { is_expected.to have_db_index(:pseudo) }
      it { is_expected.to have_db_index([:pseudo, :email]) }
    end

    describe '#email' do
      it { is_expected.to validate_presence_of(:email) }
      it { is_expected.to validate_length_of(:email).is_at_least(CONFIG.user_email_min_length) }
      it { is_expected.to validate_length_of(:email).is_at_most(CONFIG.user_email_max_length) }
      it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
      it { expect(@admin.email).to match 'admin@example.com' }
      it { is_expected.to have_db_index(:email) }
    end

    describe '#password' do
      it { is_expected.to respond_to(:password) }
      it { is_expected.to validate_presence_of(:password) }
      it { is_expected.to validate_length_of(:password).is_at_least(CONFIG.user_password_min_length) }
      it { is_expected.to validate_length_of(:password).is_at_most(CONFIG.user_password_max_length) }
      it { expect(@admin.password).to match 'foobarfoo' }
    end

    describe '#login' do
      it { is_expected.to respond_to(:login) }
    end

    # describe '#settings' do
    #   it { is_expected.to serialize(:settings) }
    # end
  end

  context 'Properties', basic: true do
    it { is_expected.to have_friendly_id(:slug) }
  end

  context 'Associations', basic: true do
  end

  context 'Public Methods', basic: true do
    subject { Admin }

    describe '::pseudo?' do
      it { is_expected.to respond_to(:pseudo?) }
      it { expect(Admin.pseudo?('Admin')).to be true }
    end

    describe '::email?' do
      it { is_expected.to respond_to(:email?) }
      it { expect(Admin.email?('admin@example.com')).to be true }
    end

    describe '::login?' do
      it { is_expected.to respond_to(:login?) }
      it { expect(Admin.login?('Admin')).to be true }
      it { expect(Admin.login?('admin@example.com')).to be true }
    end

    describe '::find_for_database_authentication' do
      it { is_expected.to respond_to(:find_for_database_authentication) }
    end
  end

  context 'Instance Methods', basic: true do
    describe '.admin?' do
      it { is_expected.to respond_to(:admin?) }
      it { expect(@admin.admin?(@admin)).to be true }
      it { expect(@admin.admin?(create(:admin))).to be false }
    end

    describe '.create_blog' do
      it { is_expected.to respond_to(:create_blog) }
    end
  end

end
