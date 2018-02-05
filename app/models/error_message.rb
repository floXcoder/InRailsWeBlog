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

class ErrorMessage < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum origin: ERROR_ORIGIN
  enums_to_tr('error_message', [:origin])

  # == Extensions ===========================================================

  # == Relationships ========================================================

  # == Validations ==========================================================
  validate :origin_type

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================
  def self.new_error(params, request = nil, current_user = nil)
    error = self.new(params)

    if request
      error.user_agent     = request.user_agent
      error.target_url     = request.url # for Rails
      error.referer_url    = request.referer # for JS
      error.request_format = request.format.to_s
      error.doc_root       = request.env['DOCUMENT_ROOT']
      error.user_ip        = request.remote_ip
    end

    if current_user
      error.user_id     = current_user.id
      error.user_pseudo = current_user.pseudo
    end

    error.app_name    = Rails.application.class.parent_name
    error.app_version = REVISION
    error.created_at  = Time.zone.now

    return error
  rescue StandardError => e
    self.new(message: "Cannot save error: #{e.message}")
  end

  # == Instance Methods =====================================================

  private

  def origin_type
    errors.add(:origin, I18n.t('errors.messages.inclusion')) if !self.origin || !ERROR_ORIGIN.include?(self.origin.to_sym)
  end

end
