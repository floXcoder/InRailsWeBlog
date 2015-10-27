class StaticPagesController < ApplicationController

  def home
    render :home
  end

  # def contact
  #   ContactMailer.delay.contact_email(params[:email], params[:name], params[:message])
  #   ContactMailer.delay.answer_email(params[:email], params[:name])
  #
  #   redirect_to root_path, flash: { notice: I18n.t('views.homepage.flash.email_sent') }
  # end

end
