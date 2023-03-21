# frozen_string_literal: true

class Admins::LogsController < AdminsController
  DEFAULT_LOG_SIZE = 3_000
  SEARCH_LOG_SIZE  = 30_000

  before_action :verify_requested_format!

  respond_to :html, :json

  def index
    log_filename = "#{Rails.env}.log"

    tags            = params.keys & tag_search
    environment_log = if tags.present?
                        h_tags = tags.map do |t|
                          {
                            element: t,
                            value:   params[t]
                          }
                        end

                        Logging.multi_grep_for(log_filename, format_tags_search(h_tags), size: SEARCH_LOG_SIZE)
                      else
                        Logging.read_latest_for(log_filename, size: DEFAULT_LOG_SIZE)
                      end

    job_log = Logging.read_latest_for('jobs.log', size: DEFAULT_LOG_SIZE)

    cron_log = Logging.read_latest_for('cron.log', size: DEFAULT_LOG_SIZE)

    ahoy_log = Logging.read_latest_for('ahoy.log', size: DEFAULT_LOG_SIZE)

    sentry_log = Logging.read_latest_for('sentry.log', size: DEFAULT_LOG_SIZE)

    seo_cache_log = Logging.read_latest_for('seo_cache.log', size: DEFAULT_LOG_SIZE)

    respond_to do |format|
      format.html do
        set_meta_tags title:   titleize_admin(I18n.t('views.admin.logs.title')),
                      noindex: true, nofollow: true

        render :index, locals: {
          log_filename:    log_filename,
          environment_log: environment_log,
          job_log:         job_log,
          cron_log:        cron_log,
          ahoy_log:        ahoy_log,
          sentry_log:      sentry_log,
          seo_cache_log:   seo_cache_log
        }
      end
    end
  end

  def stream
    log_filename = "#{Rails.env}.log"

    log_data = if log_params[:element].present?
                 if log_params[:element] == 'top'
                   Logging.read_latest_for(log_filename, size: log_params[:value].to_i + DEFAULT_LOG_SIZE)
                 elsif log_params[:element] == 'refresh'
                   Logging.read_latest_for(log_filename, size: DEFAULT_LOG_SIZE)
                 elsif log_params[:element] == 'date'
                   Logging.grep_date_for(log_filename, log_params[:value], max_size: DEFAULT_LOG_SIZE)
                 elsif log_params[:value].present?
                   Logging.grep_for(log_filename, format_search(log_params[:element], log_params[:value]), max_size: SEARCH_LOG_SIZE)
                 end
               elsif log_params[:tags].present?
                 Logging.multi_grep_for(log_filename, format_tags_search(log_params[:tags]&.map(&:to_unsafe_h)), max_size: SEARCH_LOG_SIZE)
               else
                 Logging.read_latest_for(log_filename, size: DEFAULT_LOG_SIZE)
               end

    respond_to do |format|
      format.json do
        render json: {
          environmentLog: log_data
        }
      end
    end
  end

  private

  def tag_search
    %w[bot level host ip sessionId status method format search]
  end

  def format_search(element, value)
    case element
    when 'bot'
      "[bot:#{value}]"
    when 'level'
      " #{value.upcase} --"
    when 'host', 'ip', 'sessionId'
      "[#{value}]"
    when 'status'
      "status=#{value}"
    when 'method'
      "method=#{value}"
    when 'format'
      "format=#{value}"
    when 'search'
      value
    end
  end

  def format_tags_search(tags)
    tags.map do |tag|
      format_search(tag.with_indifferent_access['element'], tag.with_indifferent_access['value'])
    end
  end

  def log_params
    if params[:logs]
      params.require(:logs).permit(:element,
                                   :value,
                                   tags: [
                                           :element,
                                           :value
                                         ])
    else
      {}
    end
  end

end
