require 'i18n/tasks'

describe 'I18n', basic: true do
  let(:translation) { I18n::Tasks::BaseTask.new }
  let(:missing_keys) { translation.missing_keys }
  let(:unused_keys) { translation.unused_keys }

  it 'does not have missing keys' do
    expect(missing_keys).to be_empty, "Missing #{missing_keys.leaves.count} i18n keys, run `i18n-tasks missing' to show them"
  end

  # it 'does not have unused keys' do
  #   expect(unused_keys).to be_empty, "#{unused_keys.leaves.count} unused i18n keys, run `i18n-tasks unused' to show them"
  # end
end
