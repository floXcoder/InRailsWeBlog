describe TagPolicy do

  before(:all) do
    @user = create(:user)
    @other_user = create(:user)

    @public_tag = create(:tag, user: @user, visibility: :everyone)
    @private_tag = create(:tag, user: @user, visibility: :only_me)
  end

  context 'for a public tag' do
    subject { TagPolicy.new(user, @public_tag) }

    context 'for a visitor' do
      let(:user) { nil }

      it { should grant(:show) }

      it { should_not grant(:create) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:destroy) }
      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
    end

    context 'for other users' do
      let(:user) { @other_user }

      it { should grant(:show) }
      it { should grant(:create) }
      it { should grant(:add_comment) }
      it { should grant(:update_comment) }
      it { should grant(:remove_comment) }

      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:destroy) }
    end

    context 'for the owner' do
      let(:user) { @user }

      it { should grant(:show) }
      it { should grant(:create) }
      it { should grant(:edit) }
      it { should grant(:update) }
      it { should grant(:destroy) }
      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
    end
  end

  context 'for a private tag' do
    subject { TagPolicy.new(user, @private_tag) }

    context 'for a visitor' do
      let(:user) { nil }

      it { should_not grant(:show) }
      it { should_not grant(:create) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:destroy) }
      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
    end

    context 'for other users' do
      let(:user) { @other_user }

      it { should grant(:create) }

      it { should_not grant(:show) }
      it { should_not grant(:edit) }
      it { should_not grant(:update) }
      it { should_not grant(:destroy) }
      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
    end

    context 'for the owner' do
      let(:user) { @user }

      it { should grant(:show) }
      it { should grant(:create) }
      it { should grant(:edit) }
      it { should grant(:update) }
      it { should grant(:destroy) }

      it { should_not grant(:add_comment) }
      it { should_not grant(:update_comment) }
      it { should_not grant(:remove_comment) }
    end
  end

end
