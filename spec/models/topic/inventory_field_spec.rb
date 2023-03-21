# frozen_string_literal: true

# == Schema Information
#
# Table name: topic_inventory_fields
#
#  id              :bigint           not null, primary key
#  topic_id        :bigint
#  name            :string           not null
#  field_name      :string           not null
#  value_type      :integer          default("string_type"), not null
#  parent_category :string
#  required        :boolean          default(FALSE), not null
#  searchable      :boolean          default(FALSE), not null
#  filterable      :boolean          default(FALSE), not null
#  priority        :integer          default(0), not null
#  visibility      :integer          default("everyone"), not null
#  deleted_at      :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
require 'rails_helper'

RSpec.describe Topic::InventoryField, type: :model do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)
  end

  before do
    @inventory_field = Topic::InventoryField.create(
      topic:      @topic,
      name:       'String field',
      field_name: 'string_field',
      value_type: :string_type,
      required:   false,
      searchable: false,
      filterable: false,
      priority:   0,
      visibility: :only_me
    )
  end

  subject { @inventory_field }

  describe 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Attributes' do
    it { is_expected.to respond_to(:name) }
    it { is_expected.to respond_to(:field_name) }
    it { is_expected.to respond_to(:value_type) }
    it { is_expected.to respond_to(:parent_category) }
    it { is_expected.to respond_to(:required) }
    it { is_expected.to respond_to(:searchable) }
    it { is_expected.to respond_to(:filterable) }
    it { is_expected.to respond_to(:priority) }
    it { is_expected.to respond_to(:visibility) }

    it { expect(@inventory_field.name).to eq('String field') }
    it { expect(@inventory_field.field_name).to eq('string_field') }
    it { expect(@inventory_field.value_type).to eq('string_type') }
    it { expect(@inventory_field.parent_category).to be_nil }
    it { expect(@inventory_field.required).to be false }
    it { expect(@inventory_field.searchable).to be false }
    it { expect(@inventory_field.filterable).to be false }
    it { expect(@inventory_field.priority).to eq(0) }
    it { expect(@inventory_field.visibility).to eq('only_me') }

    describe 'Default Attributes' do
      before do
        @inventory_field = Topic::InventoryField.create(
          topic:      @topic,
          name:       'String field',
          field_name: 'string_field',
          value_type: :string_type
        )
      end

      it { expect(@inventory_field.required).to be false }
      it { expect(@inventory_field.searchable).to be false }
      it { expect(@inventory_field.filterable).to be false }
      it { expect(@inventory_field.priority).to eq(0) }
      it { expect(@inventory_field.visibility).to eq('everyone') }
    end

    describe '#name' do
      it { is_expected.to validate_length_of(:name).is_at_least(InRailsWeBlog.settings.topic_inventory_field_name_min_length) }
      it { is_expected.to validate_length_of(:name).is_at_most(InRailsWeBlog.settings.topic_inventory_field_name_max_length) }
    end

    describe '#field_name' do
      it { is_expected.to validate_presence_of(:field_name) }
    end

    describe '#value_type' do
      it { is_expected.to have_enum(:value_type) }
      it { is_expected.to validate_presence_of(:value_type) }
    end

    describe '#visibility' do
      it { is_expected.to have_enum(:visibility) }
    end
  end

  context 'Associations' do
    it { is_expected.to belong_to(:topic) }
    it { is_expected.to validate_presence_of(:topic) }
  end

  context 'Properties' do
    it { is_expected.to callback(:generate_field_name).before(:validation) }

    it { is_expected.to have_strip_attributes([:name]) }

    it { is_expected.to act_as_paranoid(Topic::InventoryField) }
  end

  # context 'Public Methods' do
  #   subject { Topic::InventoryField }
  # end

  # context 'Instance Methods' do
  # end

end
