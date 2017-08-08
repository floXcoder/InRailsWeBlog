require 'rails_helper'

describe BookmarkPolicy, basic: true do

  before(:all) do
    @user = create(:user)
    @other_user = create(:user)

    @bookmarks = create(:bookmark, user: @user, bookmarked: create(:tag, user: @user))
  end

  subject { BookmarkPolicy.new(user, @bookmarks) }

  context 'for a visitor' do
    let(:user) { nil }

    it { should_not grant(:create) }
    it { should_not grant(:destroy) }
  end

  context 'for other users' do
    let(:user) { @other_user }

    it { should grant(:create) }

    it { should_not grant(:destroy) }
  end

  context 'for the owner' do
    let(:user) { @user }

    it { should grant(:create) }
    it { should grant(:destroy) }
  end

end
