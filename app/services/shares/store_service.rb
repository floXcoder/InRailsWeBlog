# frozen_string_literal: true

module Shares
  class StoreService < BaseService
    def initialize(shareable, login, *args)
      super(*args)

      @shareable = shareable
      @login     = login
    end

    def perform
      user = User.find_by_login(@login)

      if user
        return error(I18n.t('views.share.errors.already_shared')) if Share.shared_with?(@current_user.id, @shareable, user.id)

        return error(I18n.t('views.share.errors.private_shareable')) if @shareable.only_me?

        shared = @shareable.shares.build(user_id: @current_user.id, contributor_id: user.id)

        if shared.save
          success(@shareable.reload, I18n.t('views.share.success.message', user: user.pseudo))
        else
          error(I18n.t('views.share.errors.creation'), shared.errors)
        end
      else
        error(I18n.t('views.share.errors.user_not_found'))
      end
    end
  end
end
