class StaticPagesController < ApplicationController

  def home
    if current_user
      redirect_to root_user_path(current_user)
    else
      # render :home, locals: { recent_outings: recent_outings }
      render :home
    end
  end

  # def contact
  #   ContactMailer.delay.contact_email(params[:email], params[:name], params[:message])
  #   ContactMailer.delay.answer_email(params[:email], params[:name])
  #
  #   redirect_to root_path, flash: { notice: I18n.t('views.homepage.flash.email_sent') }
  # end

end
