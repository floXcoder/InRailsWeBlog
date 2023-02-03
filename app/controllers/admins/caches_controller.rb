# frozen_string_literal: true

class Admins::CachesController < AdminsController
  before_action :verify_requested_format!

  respond_to :html, :json

  def index
    respond_to do |format|
      format.html do
        set_meta_tags title:   titleize_admin(I18n.t('views.admin.cache.title')),
                      noindex: true, nofollow: true

        render :index
      end
    end
  end

  def flush_cache
    app            = Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cache", redis: Redis.new(host: ENV['REDIS_HOST'], port: ENV['REDIS_PORT'], db: ENV['REDIS_DB'].to_i))
    app.keys.each { |key| app.del(key) }

    app            = Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer", redis: Redis.new(host: ENV['REDIS_HOST'], port: ENV['REDIS_PORT'], db: ENV['REDIS_DB'].to_i))
    app.keys.each { |key| app.del(key) }

    app = Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer-options", redis: Redis.new(host: ENV['REDIS_HOST'], port: ENV['REDIS_PORT'], db: ENV['REDIS_DB'].to_i))
    app.keys.each { |key| app.del(key) }

    respond_to do |format|
      format.json { render json: { success: true } }
    end
  end

end
