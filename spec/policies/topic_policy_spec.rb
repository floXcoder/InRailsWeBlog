describe TopicPolicy do

  before(:all) do
    @user = create(:user)
    @other_user = create(:user)

    @public_topic = create(:topic, user: @user, visibility: :everyone)
    @private_topic = create(:topic, user: @user, visibility: :only_me)
  end

  context 'for a public topic' do
    subject { TopicPolicy.new(user, @public_topic) }

    context 'for a visitor' do
      let(:user) { nil }

      it { should_not grant(:add_topic) }
      it { should_not grant(:change_topic) }
      it { should_not grant(:update_topic) }
      it { should_not grant(:remove_topic) }
    end

    context 'for other users' do
      let(:user) { @other_user }

      it { should grant(:add_topic) }
      it { should grant(:change_topic) }

      it { should_not grant(:update_topic) }
      it { should_not grant(:remove_topic) }
    end

    context 'for the owner' do
      let(:user) { @user }

      it { should grant(:add_topic) }
      it { should grant(:change_topic) }
      it { should grant(:update_topic) }
      it { should grant(:remove_topic) }
    end
  end

  context 'for a private topic' do
    subject { TopicPolicy.new(user, @private_topic) }

    context 'for a visitor' do
      let(:user) { nil }

      it { should_not grant(:add_topic) }
      it { should_not grant(:change_topic) }
      it { should_not grant(:update_topic) }
      it { should_not grant(:remove_topic) }
    end

    context 'for other users' do
      let(:user) { @other_user }

      it { should grant(:add_topic) }
      it { should grant(:change_topic) }

      it { should_not grant(:update_topic) }
      it { should_not grant(:remove_topic) }
    end

    context 'for the owner' do
      let(:user) { @user }

      it { should grant(:add_topic) }
      it { should grant(:change_topic) }
      it { should grant(:update_topic) }
      it { should grant(:remove_topic) }
    end
  end

end
