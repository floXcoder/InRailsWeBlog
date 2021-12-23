# frozen_string_literal: true

require 'rails_helper'

describe PicturePolicy do

  before(:all) do
    @owner_user = create(:user)
    @other_user = create(:user)

    @topic   = create(:topic, user: @owner_user)
    @article = create(:article, user: @owner_user, topic: @topic)

    @picture = FactoryBot.create(:picture, user: @owner_user, imageable: @article)
  end

  subject { PicturePolicy.new(user, @picture) }

  context 'for a visitor' do
    let(:user) { nil }

    it { should_not grant(:create) }
    it { should_not grant(:update) }
    it { should_not grant(:destroy) }
  end

  context 'for other users' do
    let(:user) { @other_user }

    it { should grant(:create) }

    it { should_not grant(:update) }
    it { should_not grant(:destroy) }
  end

  context 'for the owner' do
    let(:user) { @owner_user }

    it { should grant(:create) }
    it { should grant(:update) }
    it { should grant(:destroy) }
  end

end
