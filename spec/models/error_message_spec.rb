# frozen_string_literal: true

# == Schema Information
#
# Table name: error_messages
#
#  id             :integer          not null, primary key
#  class_name     :text
#  message        :text
#  trace          :text
#  line_number    :text
#  column_number  :text
#  params         :text
#  target_url     :text
#  referer_url    :text
#  user_agent     :text
#  app_name       :string
#  doc_root       :string
#  user_ip        :string
#  origin         :integer          default("server"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  request_format :string
#  app_version    :string
#  user_id        :string
#  user_pseudo    :string
#  user_locale    :string
#  bot_agent      :string
#  os_agent       :string
#

require 'rails_helper'

RSpec.describe ErrorMessage, type: :model, basic: true do

  before do
    @error_message = ErrorMessage.create(
      origin:        :server,
      class_name:    'User',
      message:       'Error User class',
      trace:         'user.rb: line 20',
      line_number:   '20',
      column_number: '5',
      params:        '{model => "user"}',
      target_url:    '/users',
      referer_url:   '/',
      user_agent:    'firefox',
      app_name:      'My App',
      doc_root:      '/my_app',
      user_ip:       '127.0.0.1'
    )
  end

  subject { @error_message }

  context 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Attributes' do
    it { is_expected.to respond_to(:class_name) }
    it { is_expected.to respond_to(:message) }
    it { is_expected.to respond_to(:trace) }
    it { is_expected.to respond_to(:line_number) }
    it { is_expected.to respond_to(:column_number) }
    it { is_expected.to respond_to(:params) }
    it { is_expected.to respond_to(:target_url) }
    it { is_expected.to respond_to(:referer_url) }
    it { is_expected.to respond_to(:user_agent) }
    it { is_expected.to respond_to(:app_name) }
    it { is_expected.to respond_to(:doc_root) }
    it { is_expected.to respond_to(:user_ip) }
    it { is_expected.to respond_to(:origin) }

    it { expect(@error_message.class_name).to match 'User' }
    it { expect(@error_message.message).to match 'Error User class' }
    it { expect(@error_message.trace).to match 'user.rb: line 20' }
    it { expect(@error_message.line_number).to match '20' }
    it { expect(@error_message.column_number).to match '5' }
    it { expect(@error_message.params).to match '{model => "user"}' }
    it { expect(@error_message.target_url).to match '/users' }
    it { expect(@error_message.referer_url).to match '/' }
    it { expect(@error_message.user_agent).to match 'firefox' }
    it { expect(@error_message.app_name).to match 'My App' }
    it { expect(@error_message.doc_root).to match '/my_app' }
    it { expect(@error_message.user_ip).to match '127.0.0.1' }
    it { expect(@error_message.origin).to match 'server' }

    describe 'enums' do
      it { is_expected.to have_enum(:origin) }
    end
  end

  context 'Public Methods' do
    subject { ErrorMessage }

    describe '::new_error' do
      it { is_expected.to respond_to(:new_error) }
      it { expect(ErrorMessage.new_error(
        class_name:    'User',
        message:       'Error User class',
        trace:         'user.rb: line 20',
        line_number:   '20',
        column_number: '5',
        params:        '{model => "user"}',
        target_url:    '/users',
        referer_url:   '/',
        app_name:      'My App',
        doc_root:      '/my_app',
        origin:        'server')
      ).to be_a(ErrorMessage) }
    end
  end

end
