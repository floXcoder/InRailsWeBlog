describe UserPolicy do
  let(:current_user)      { FactoryGirl.create(:user, :confirmed) }
  let(:other_user)        { FactoryGirl.create(:user, :confirmed) }

  subject { UserPolicy.new(current_user, user) }

  context 'for a visitor', basic: true do
    let(:current_user) { nil }
    let(:user) { nil }

    it { should_not grant(:main) }
    it { should_not grant(:show) }
    it { should_not grant(:edit) }
    it { should_not grant(:update) }
    it { should_not grant(:destroy) }
  end

  context 'for another user', basic: true do
    let(:user) { other_user }

    it { should_not grant(:main) }
    it { should_not grant(:show) }
    it { should_not grant(:edit) }
    it { should_not grant(:update) }
    it { should_not grant(:destroy) }
  end

  context 'for the current user', basic: true do
    let(:user) { current_user }

    it { should grant(:main) }
    it { should grant(:show) }
    it { should grant(:edit) }
    it { should grant(:update) }
    it { should grant(:destroy) }
  end
end
