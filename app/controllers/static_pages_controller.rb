class StaticPagesController < ApplicationController

  respond_to :html, :text

  def home
    respond_to do |format|
      format.html do
        render :home
      end
    end
  end

end
