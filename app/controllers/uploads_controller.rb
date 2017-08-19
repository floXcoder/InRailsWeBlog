class UploadsController < ApplicationController
  before_action :authenticate_user!
  before_action :verify_requested_format!
  after_action :verify_authorized

  respond_to :json

  def create
    upload = current_user.uploads.build
    admin_or_authorize upload

    if upload_params[:model] && upload_params[:model_id]
      class_model = upload_params[:model].classify.constantize
      model       = class_model.find(upload_params[:model_id])
      admin_or_authorize model
    end

    upload.format_attributes(upload_params)

    respond_to do |format|
      format.json do
        if upload.save
          # flash.now[:success] = t('views.upload.flash.successful_creation')
          render json:       upload,
                 root:       'upload',
                 serializer: UploadSerializer,
                 status:     :created
        else
          # flash.now[:error] = t('views.upload.flash.error_creation')
          render json:   { error: upload.errors.full_messages.join(',') },
                 status: :forbidden
        end
      end
    end
  end

  def update
    upload = Picture.find(params[:id])
    admin_or_authorize upload

    if upload_params[:model] && upload_params[:model_id]
      class_model = upload_params[:model].classify.constantize
      model       = class_model.find(upload_params[:model_id])
      admin_or_authorize model
    end

    upload.format_attributes(upload_params)

    respond_to do |format|
      format.json do
        if upload.save
          # flash.now[:success] = t('views.upload.flash.successful_edition')
          render json:       upload,
                 root:       'upload',
                 serializer: UploadSerializer,
                 status:     :ok
        else
          # flash.now[:error] = t('views.upload.flash.error_edition')
          render json:   { error: upload.errors.full_messages.join(',') },
                 status: :forbidden
        end
      end
    end
  end

  def destroy
    upload = Picture.find(params[:id])
    admin_or_authorize upload

    respond_to do |format|
      format.json do
        if upload.destroy
          # flash.now[:success] = t('views.upload.flash.successful_deletion')
          render json:   { id: upload.id },
                 status: :accepted
        else
          # flash.now[:error] = t('views.upload.flash.error_deletion')
          render json:   { error: upload.errors.full_messages.join(',') },
                 status: :forbidden
        end
      end
    end
  end

  private

  def upload_params
    params.require(:upload).permit(:user_id,
                                   :model,
                                   :model_id,
                                   :description,
                                   :copyright,
                                   :file,
                                   :process_now).tap do |whitelisted|
      whitelisted[:files] = params[:upload][:files] if params[:upload][:files]
    end
  end

end
