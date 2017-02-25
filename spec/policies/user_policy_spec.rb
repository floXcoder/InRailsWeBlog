describe UserPolicy do

  before(:all) do
    @user = create(:user)
    @other_user = create(:user)
  end

  context 'for a visitor', basic: true do
    let(:current_user) { nil }
    let(:user) { nil }

    subject { UserPolicy.new(user, @user) }

    it { should_not grant(:main) }
    it { should_not grant(:show) }
    it { should_not grant(:edit) }
    it { should_not grant(:update) }
    it { should_not grant(:destroy) }
  end

  context 'for another user', basic: true do
    let(:user) { @other_user }

    subject { UserPolicy.new(user, @user) }

    it { should_not grant(:main) }
    it { should_not grant(:show) }
    it { should_not grant(:edit) }
    it { should_not grant(:update) }
    it { should_not grant(:destroy) }
  end

  context 'for the current user', basic: true do
    let(:user) { @user }

    subject { UserPolicy.new(user, @user) }

    it { should grant(:main) }
    it { should grant(:show) }
    it { should grant(:edit) }
    it { should grant(:update) }
    it { should grant(:destroy) }
  end
end
