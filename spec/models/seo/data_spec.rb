require 'rails_helper'

RSpec.describe Seo::Data, type: :model, basic: true do

  before do
    @seo_data = Seo::Data.create(
      name:       'home_en',
      locale:     'en',
      parameters: [],
      page_title: 'Home title',
      meta_desc:  'Home meta-desc',
      languages:  ['en']
    )
  end

  subject { @seo_data }

  describe 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Attributes' do
    it { is_expected.to respond_to(:name) }
    it { is_expected.to respond_to(:locale) }
    it { is_expected.to respond_to(:parameters) }
    it { is_expected.to respond_to(:page_title) }
    it { is_expected.to respond_to(:meta_desc) }
    it { is_expected.to respond_to(:languages) }

    it { expect(@seo_data.name).to eq('home_en') }
    it { expect(@seo_data.locale).to eq('en') }
    it { expect(@seo_data.parameters).to eq([]) }
    it { expect(@seo_data.page_title).to eq('Home title') }
    it { expect(@seo_data.meta_desc).to eq('Home meta-desc') }
    it { expect(@seo_data.languages).to eq(['en']) }

    describe 'Default Attributes' do
      before do
        @seo_data = Seo::Data.create(
          name:       'home_fr',
          locale:     'fr',
          page_title: 'Home title fr',
          meta_desc:  'Home meta-desc fr'
        )
      end

      it { expect(@seo_data).to be_valid }
      it { expect(@seo_data.parameters).to eq([]) }
      it { expect(@seo_data.languages).to eq([]) }
    end

    describe '#name' do
      it { is_expected.to validate_presence_of(:name) }

      it 'must be a declared route' do
        unknown_route = Seo::Data.new(
          name:       'unknown_route',
          locale:     'fr',
          page_title: 'Home title fr',
          meta_desc:  'Home meta-desc fr'
        )

        expect(unknown_route.save).to be false
        expect(unknown_route.errors[:base].first).to eq(I18n.t('activerecord.errors.models.seo_data.bad_route_name'))
      end
    end

    describe '#page_title' do
      it { is_expected.to validate_presence_of(:page_title) }
    end
  end

  context 'Properties' do
    it { is_expected.to have_strip_attributes([:page_title, :meta_desc]) }
  end

  context 'Public Methods' do
    subject { Seo::Data }

    describe '::local_named_routes' do
      it { is_expected.to respond_to(:local_named_routes) }
      it { expect(Seo::Data.local_named_routes.size).to eq(Seo::Data::NAMED_ROUTES.size * I18n.available_locales.size) }
      it { expect(Seo::Data.local_named_routes.first).to eq('home_en') }
    end

    describe '::associated_parameters' do
      it { is_expected.to respond_to(:associated_parameters) }
      it { expect(Seo::Data.associated_parameters).to be_a(Hash) }
    end
  end

end
