# == Schema Information
#
# Table name: error_messages
#
#  id            :integer          not null, primary key
#  class_name    :text
#  message       :text
#  trace         :text
#  line_number   :text
#  column_number :text
#  params        :text
#  target_url    :text
#  referer_url   :text
#  user_agent    :text
#  user_info     :string
#  app_name      :string
#  doc_root      :string
#  ip            :string
#  origin        :integer          default(0), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class ErrorMessage < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum origin: ERROR_ORIGIN
  enums_to_tr('error_message', [:origin])

  # == Extensions ===========================================================

  # == Relationships ========================================================

  # == Validations ==========================================================

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================
  def self.new_error(params, request, current_user = nil)
    error            = self.new(params)
    error.user_agent = request.user_agent
    error.ip         = request.remote_ip
    error.user_info  = current_user.pseudo if current_user

    return error
  end

  # == Instance Methods =====================================================

end
