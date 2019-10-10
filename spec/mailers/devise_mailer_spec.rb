# frozen_string_literal: true

RSpec.describe DeviseMailer, type: :mailer, advanced: true do

  before(:all) do
    @user = create(:user, not_confirmed: true)
  end

  describe 'account activation' do
    let(:mail) { DeviseMailer.confirmation_instructions(@user, @user.confirmation_token) }

    it 'renders the headers' do
      expect(mail.subject).to eq(t('devise.mailer.confirmation_instructions.subject'))
      expect(mail.to).to eq([@user.email])
      expect(mail.from).to eq([ENV['EMAIL_USER']])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to match(@user.pseudo)
      expect(mail.body.encoded).to match(@user.confirmation_token)
    end
  end

  describe 'reset password instructions' do
    before { @user.send_reset_password_instructions }

    let(:mail) { DeviseMailer.reset_password_instructions(@user, @user.reset_password_token) }

    it 'renders the headers' do
      expect(mail.subject).to eq(t('devise.mailer.reset_password_instructions.subject'))
      expect(mail.to).to eq([@user.email])
      expect(mail.from).to eq([ENV['EMAIL_USER']])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to match(@user.pseudo)
      expect(mail.body.encoded).to match(@user.reset_password_token)
    end
  end

  describe 'unlock instructions' do
    before { @user.send_unlock_instructions }

    let(:mail) { DeviseMailer.unlock_instructions(@user, @user.unlock_token) }

    it 'renders the headers' do
      expect(mail.subject).to eq(t('devise.mailer.unlock_instructions.subject'))
      expect(mail.to).to eq([@user.email])
      expect(mail.from).to eq([ENV['EMAIL_USER']])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to match(@user.pseudo)
      expect(mail.body.encoded).to match(@user.unlock_token)
    end
  end
end
