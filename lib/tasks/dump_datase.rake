# encoding: UTF-8
namespace :InRailsWeBlog do

  desc 'Dump database'
  task dump: :environment do

    dump_dir = Rails.root.join('db', 'dump')
    FileUtils.mkdir_p(dump_dir) unless File.directory?(dump_dir)

    dump_file = Rails.root.join('db', 'dump', 'seeds.rb')
    %x{rake db:seed:dump FILE=#{dump_file}}

    # SeedDump.dump(User, file: 'db/dump/users.rb')
  end
end
