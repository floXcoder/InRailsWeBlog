# frozen_string_literal: true

class Admins::LogsController < AdminsController
  def index
    log_filename = Rails.env + '.log'

    tags            = params.keys & tag_search
    environment_log = if tags.present?
                        h_tags = tags.map do |t|
                          {
                            element: t,
                            value:   params[t]
                          }
                        end

                        Logging.multi_grep_for(log_filename, format_tags_search(h_tags), 6_000)
                      else
                        Logging.read_latest_for(log_filename, 2_000)
                      end

    job_log = Logging.read_latest_for('sidekiq.log', 2_000)

    cron_log = Logging.read_latest_for('cron.log', 2_000)

    seo_cache_log = Logging.read_latest_for('seo_cache.log', 2_000)

    respond_to do |format|
      format.html do
        set_meta_tags title:   titleize_admin(I18n.t('views.admin.logs.title')),
                      noindex: true, nofollow: true

        render :index, locals: {
          log_filename:    log_filename,
          environment_log: environment_log,
          job_log:         job_log,
          cron_log:        cron_log,
          seo_cache_log:   seo_cache_log
        }
      end
    end
  end

  def stream
    log_filename = Rails.env + '.log'

    log_data = if log_params[:element].present?
                 if log_params[:element] == 'top'
                   Logging.read_latest_for(log_filename, log_params[:value].to_i + 2_000)
                 elsif log_params[:element] == 'refresh'
                   Logging.read_latest_for(log_filename, 2_000)
                 elsif log_params[:element] == 'date'
                   Logging.grep_date_for(log_filename, log_params[:value], 2_000)
                 elsif log_params[:value].present?
                   Logging.grep_for(log_filename, format_search(log_params[:element], log_params[:value]), 6_000)
                 end
               elsif log_params['tags'].present?
                 Logging.multi_grep_for(log_filename, format_tags_search(log_params['tags'].to_unsafe_h.values), 6_000)
               else
                 Logging.read_latest_for(log_filename, 2_000)
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
    %w[bot level host ip sessionId status search]
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
    when 'search'
      value
    else
      nil
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
