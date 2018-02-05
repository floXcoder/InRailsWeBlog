class Users::SettingsController < ApplicationController
  before_action :authenticate_user!
  before_action :verify_requested_format!
  after_action :verify_authorized

  respond_to :json

  def index
    user = User.find(params[:user_id])
    authorize user, :settings?

    respond_to do |format|
      format.json do
        render json: user,
               root: 'settings',
               serializer: SettingSerializer
      end
    end
  end

  def update
    user = User.find(params[:user_id])
    authorize user, :settings?

    if params[:settings]
      params[:settings].each do |pref_type, pref_value|
        if pref_value == 'true'
          pref_value = true
        elsif pref_value == 'false'
          pref_value = false
        end
        user.settings[pref_type.downcase.to_s] = pref_value
      end
      user.save
    end

    respond_to do |format|
      format.json do
        render json: user,
               root: 'settings',
               serializer: SettingSerializer
      end
    end
  end

end
