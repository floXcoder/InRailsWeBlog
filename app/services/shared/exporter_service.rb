# frozen_string_literal: true

require 'zip'

class ZipFileGenerator
  # Initialize with the directory to zip and the location of the output archive.
  def initialize(input_dir, output_file)
    @input_dir   = input_dir
    @output_file = output_file
  end

  # Zip the input directory.
  def write
    entries = Dir.entries(@input_dir) - %w[. ..]

    ::Zip::File.open(@output_file, ::Zip::File::CREATE) do |zipfile|
      write_entries entries, '', zipfile
    end
  end

  private

  # A helper method to make the recursion work.
  def write_entries(entries, path, zipfile)
    entries.each do |e|
      zipfile_path   = path == '' ? e : File.join(path, e)
      disk_file_path = File.join(@input_dir, zipfile_path)

      if File.directory? disk_file_path
        recursively_deflate_directory(disk_file_path, zipfile, zipfile_path)
      else
        put_into_archive(disk_file_path, zipfile, zipfile_path)
      end
    end
  end

  def recursively_deflate_directory(disk_file_path, zipfile, zipfile_path)
    zipfile.mkdir(zipfile_path)
    subdir = Dir.entries(disk_file_path) - %w[. ..]
    write_entries subdir, zipfile_path, zipfile
  end

  def put_into_archive(disk_file_path, zipfile, zipfile_path)
    zipfile.add(zipfile_path, disk_file_path)
  end
end

module Shared
  class ExporterService < ::BaseService
    def initialize(user_id, *args)
      super(*args)

      @params[:user_id] = user_id
    end

    def perform
      user = User.find(@params[:user_id])

      FileUtils.rm_rf(Rails.root.join('tmp/exporter', user.slug))

      FileUtils.mkdir_p(Rails.root.join('tmp/exporter', user.slug))

      begin
        user.articles.includes(:topic, :tags).each do |article|
          FileUtils.mkdir_p(Rails.root.join('tmp/exporter', user.slug, article.topic.slug))

          html_render = ApplicationController.render(template: 'exporter/article',
                                                     layout:   'exporter',
                                                     locals:   {
                                                       user:    user,
                                                       title:   article.title,
                                                       article: article
                                                     })

          File.write(Rails.root.join('tmp/exporter', user.slug, article.topic.slug, "#{article.slug}.html"), html_render)
          if article.pictures.count > 0
            FileUtils.mkdir_p(Rails.root.join('tmp/exporter', user.slug, article.topic.slug, "#{article.slug}_files"))
            article.pictures.each do |picture|
              image = open("#{ENV['WEBSITE_URL']}/#{picture.image_url}", read_timeout: 5) rescue nil
              if image
                File.open(Rails.root.join('tmp/exporter', user.slug, article.topic.slug, "#{article.slug}_files", picture.image.identifier), 'wb') do |file|
                  file.write(image.read)
                end
              end
            end
          end
        end

        zip_name = Rails.root.join('tmp/exporter', "#{user.slug}_export.zip")

        zip_directory(Rails.root.join('tmp/exporter', user.slug), zip_name)

        FileUtils.remove_dir(Rails.root.join('tmp/exporter', user.slug))

        success(zip_name)
      rescue StandardError => error
        error(I18n.t('exporter.errors'), error)
      end
    end

    private

    def zip_directory(path, zip_name)
      zf = ZipFileGenerator.new(path, zip_name)
      zf.write
    end
  end
end
