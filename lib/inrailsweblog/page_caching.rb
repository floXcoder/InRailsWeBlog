# frozen_string_literal: true

class PageCaching
  def initialize(cache_directory, default_extension)
    @cache_directory   = cache_directory
    @default_extension = default_extension
  end

  def cache(content, path, extension = nil, gzip = Zlib::BEST_COMPRESSION)
    instrument :write_page, path do
      write(content, cache_path(path, extension), gzip)
    end
  end

  def expire(path)
    instrument :expire_page, path do
      delete(cache_path(path))
    end
  end

  private

  def cache_directory
    @cache_directory.to_s
  end

  def default_extension
    @default_extension
  end

  def cache_file(path, extension)
    if path.empty? || path =~ %r{\A/+\z}
      name = '/index'
    else
      name = URI.parser.unescape(path.chomp('/'))
    end

    if File.extname(name).empty?
      name + (extension || default_extension)
    else
      name
    end
  end

  def cache_path(path, extension = nil)
    File.join(cache_directory, cache_file(path, extension))
  end

  def delete(path)
    File.delete(path) if File.exist?(path)
    File.delete(path + '.gz') if File.exist?(path + '.gz')
  end

  def write(content, path, gzip)
    FileUtils.makedirs(File.dirname(path))
    File.open(path, 'wb+') { |f| f.write(content) }

    if gzip
      Zlib::GzipWriter.open(path + '.gz', gzip) { |f| f.write(content) }
    end
  end

  def instrument(name, path)
    ActiveSupport::Notifications.instrument("#{name}.action_controller", path: path) { yield }
  end
end
