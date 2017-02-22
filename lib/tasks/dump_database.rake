# encoding: UTF-8
namespace :InRailsWeBlog do
  desc 'Dump database into YAML files'
  task :dump, [:dir_name] => :environment do |t, args|
    dump_path = Rails.root.join('db', 'dump')
    FileUtils.mkdir_p(dump_path) unless File.directory?(dump_path)

    dump_dir_name = 'dump/' + (args[:dir_name] || Time.now.strftime('%Y_%m_%d_%H_%M_%S'))

    begin
      ENV['dir'] = dump_dir_name
      Rake::Task['db:data:dump_dir'].reenable
      Rake::Task['db:data:dump_dir'].invoke
    end
  end

  desc 'Restore database'
  task restore: :environment do |t, args|
    dump_path = Rails.root.join('db', 'dump')

    dumps = Dir.entries(dump_path).select { |entry| File.directory? File.join(dump_path, entry) and !(entry =='.' || entry == '..') }
    dump = 'dump/' + (args[:dir_name] || dumps.sort.last)

    begin
      ENV['dir'] = dump
      Rake::Task['db:data:load_dir'].reenable
      Rake::Task['db:data:load_dir'].invoke
    end
  end
end
