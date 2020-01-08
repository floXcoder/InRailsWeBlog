# frozen_string_literal: true

namespace :InRailsWeBlog do

  desc 'Load server tests'
  task :load_tests, [] => :environment do |_task, _args|
    require 'ruby-jmeter'

    test do
      threads 80, ramp_time: 60, duration: 15.minutes.to_i, continue_forever: true do
        extract name:  'authenticity_token',
                regex: 'meta name="csrf-token" content="(.+?)"'

        # think_time 2_000, 500

        cookies policy: 'compatibility', clear_each_iteration: true

        visit name: 'Home page', url: 'https://www.ginkonote.com'

        header [
                 { name: 'Content-Type', value: 'application/json' }
               ]
        params = {
          'utf8'               => '✓',
          'authenticity_token' => '${authenticity_token}',
          user:                {
            'login'    => 'Flo',
            'password' => '!!PASSWORD!!'
          }
        }
        submit name:          'Login',
               url:           'https://www.ginkonote.com/api/v1/login',
               always_encode: true,
               raw_body:      params.to_json do
          with_xhr
        end

        visit name: 'Home content', url: 'https://www.ginkonote.com' do
          assert contains: 'window.currentUserSlug = "flo";'
        end

        get name: 'User profile',
            url:  'https://www.ginkonote.com/api/v1/users/2.json?profile=true' do
          with_xhr
          assert contains: 'pseudo'
        end

        get name: 'Switch topic',
            url:  'https://www.ginkonote.com/api/v1/topics/switch.json?userId=2&newTopicId=4' do
          with_xhr
          assert contains: 'Perso'
        end

        get name: 'Tags list',
            url:  'https://www.ginkonote.com/api/v1/tags.json?filter%5BtopicId%5D=4' do
          with_xhr
          assert contains: 'Firefox'
        end

        get name: 'Article index',
            url:  'https://www.ginkonote.com/api/v1/articles.json?filter%5BuserId%5D=2&filter%5BtopicId%5D=4&filter%5BuserSlug%5D=flo&filter%5BtopicSlug%5D=perso' do
          with_xhr
          assert contains: 'story'
        end
      end

      view_results_tree
      summary_report

    end.run(gui: true)

  end

end
