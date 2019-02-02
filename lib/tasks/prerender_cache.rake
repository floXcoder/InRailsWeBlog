# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:prerender_cache
  desc "Cache prerender pages"
  task :prerender_cache, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.warn("#{Time.zone.now} : Cache pages with prerender")

    server_pid = spawn "node #{Rails.root.join('lib', 'tasks', 'prerender', "prerender_#{Rails.env.production? ? 'prod' : 'dev'}_server.js")}"
    # Waiting for starting server
    sleep 3

    headers    = { 'User-Agent' => 'Mozilla/5.0 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)' }
    url_source = Rails.env.production? ? 'https://www.inrailsweblog.com/' : 'http://localhost:3000'

    # Root
    HTTP.headers(headers).get(url_source + '/')

    # Articles
    Article.includes(:user).everyone.find_in_batches(batch_size: 200) do |articles|
      articles.each do |article|
        HTTP.headers(headers).get(url_source + "/users/#{article.user.slug}/articles/#{article.slug}")
      end
    end

    # ...

    Process.kill('QUIT', server_pid)
    Process.detach(server_pid)
    # Waiting for ending server
    sleep 2
  end
end
