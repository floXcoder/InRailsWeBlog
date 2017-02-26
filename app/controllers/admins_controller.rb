# == Schema Information
#
# Table name: admins
#
#  id                     :integer          not null, primary key
#  pseudo                 :string           default(""), not null
#  additional_info        :string           default("")
#  locale                 :string           default("fr")
#  settings            :text             default({}), not null
#  slug                   :string
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class AdminsController < ApplicationController
  layout 'admin'

  before_action :authenticate_admin!
  before_action :reset_cache_headers

  respond_to :html

  def index
    respond_to do |format|
      format.html do
        set_meta_tags title:    titleize_admin(I18n.t('views.admin.dashboard.title')),
                      noindex:  true,
                      nofollow: true
        render 'admin/index'
      end
    end
  end

end
