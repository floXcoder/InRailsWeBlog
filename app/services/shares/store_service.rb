# frozen_string_literal: true

module Shares
  class StoreService < BaseService
    def initialize(shareable, *args)
      super(*args)

      @shareable = shareable
    end

    def perform
      if @params[:login].present?
        share_with_user
      else
        share_by_link
      end
    end

    private

    def share_by_link
      return error(I18n.t('views.share.errors.link_already_shared')) if Share.shared?(@current_user.id, @shareable)

      return error(I18n.t('views.share.errors.useless_shareable')) if @shareable.everyone?

      shared = @shareable.build_share(mode: :link, user_id: @current_user.id)

      if shared.save
        success(@shareable.reload, I18n.t('views.share.success.link_message'))
      else
        error(I18n.t('views.share.errors.creation'), shared.errors)
      end
    end

    def share_with_user
      user = User.find_by_login(@params[:login])

      if user
        return error(I18n.t('views.share.errors.user_already_shared')) if Share.shared_with?(@current_user.id, @shareable, user.id)

        return error(I18n.t('views.share.errors.private_shareable')) if @shareable.only_me?

        shared = @shareable.shares.build(mode: :with_user, user_id: @current_user.id, contributor_id: user.id)

        if shared.save
          success(@shareable.reload, I18n.t('views.share.success.user_message', user: user.pseudo))
        else
          error(I18n.t('views.share.errors.creation'), shared.errors)
        end
      else
        error(I18n.t('views.share.errors.user_not_found'))
      end
    end

  end
end
