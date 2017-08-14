RSpec.describe ApplicationHelper, type: :helper, basic: true do
  describe '#titleize' do
    it 'returns the page title' do
      expect(helper.titleize('my title')).to eq('(Test) | my title')
    end
  end

  describe '#titleize_admin' do
    it 'returns the admin page title' do
      expect(helper.titleize_admin('my title')).to eq('(Test) | (ADMIN) | my title')
    end
  end

  describe '#webmail_from_email', advanced: true do
    it 'returns webmail from email address' do
      expect(helper.webmail_from_email('test@gmail.com')).to eq(['gmail', 'https://mail.google.com/'])
      expect(helper.webmail_from_email('test.test@yahoo.com')).to eq(['yahoo', 'https://mail.yahoo.com/'])
      expect(helper.webmail_from_email('test@test@gmail.com')).to be false
      expect(helper.webmail_from_email('test@unknown.com')).to be false
    end
  end
end
