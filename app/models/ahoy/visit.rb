# frozen_string_literal: true

# == Schema Information
#
# Table name: ahoy_visits
#
#  id               :bigint           not null, primary key
#  visit_token      :string
#  visitor_token    :string
#  user_id          :bigint
#  ip               :string
#  user_agent       :text
#  referrer         :text
#  referring_domain :string
#  landing_page     :text
#  takeoff_page     :text
#  events_count     :integer          default(0)
#  pages_count      :integer          default(0)
#  browser          :string
#  os               :string
#  device_type      :string
#  country          :string
#  region           :string
#  city             :string
#  latitude         :float
#  longitude        :float
#  utm_source       :string
#  utm_medium       :string
#  utm_term         :string
#  utm_content      :string
#  utm_campaign     :string
#  app_version      :string
#  os_version       :string
#  platform         :string
#  started_at       :datetime
#  ended_at         :datetime
#  validated        :boolean          default(FALSE), not null
#
class Ahoy::Visit < ApplicationRecord

  # == Attributes ===========================================================
  self.table_name = 'ahoy_visits'

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :user,
             optional: true

  has_many :events,
           class_name: 'Ahoy::Event'

  has_many :articles

  # == Validations ==========================================================

  # == Scopes ===============================================================
  scope :validated, -> { where(validated: true) }
  scope :external, -> (excluded_user_ids = nil) do
    external_scope = self

    if excluded_user_ids
      external_scope = external_scope.where.not(user_id: excluded_user_ids).or(self.where(user_id: nil))
    end

    if ENV['TRACKER_EXCLUDED_IPS'].present?
      external_scope = external_scope.where.not(ip: ENV['TRACKER_EXCLUDED_IPS'].split(', '))
    end

    external_scope
  end

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
