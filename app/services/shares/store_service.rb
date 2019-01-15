# frozen_string_literal: true

module Shares
  class StoreService < BaseService
    def initialize(topic, login, *args)
      super(*args)

      @topic = topic
      @login = login
    end

    def perform
      user = User.find_by_login(@login)

      if user
        return error(I18n.t('views.share.errors.already_shared'), I18n.t('views.share.errors.already_shared')) if Share.shared_with?(@current_user.id, @topic, user.id)

        shared = @topic.shares.build(user_id: @current_user.id, contributor_id: user.id)

        if shared.save
          success(@topic.reload, I18n.t('views.share.success.message', user: user.pseudo))
        else
          error(I18n.t('views.share.errors.creation'), shared.errors)
        end
      else
        error(I18n.t('views.share.errors.user_not_found'), @article.errors)
      end
    end
  end
end
