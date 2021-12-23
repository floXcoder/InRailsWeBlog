# frozen_string_literal: true

RSpec.describe ApplicationHelper, type: :helper do
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
end
