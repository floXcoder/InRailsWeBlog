# frozen_string_literal: true

class AssetManifest
  @manifest      = nil
  @hash_manifest = nil
  @loaded_files  = []

  def self.manifest
    asset_file = Rails.public_path.join('assets/manifest.json')

    if Rails.env.development?
      # @manifest ||= URI.open("#{assets_root_url}/manifest.json", &:read)
      @manifest = JSON.parse(File.read(asset_file))
    else
      @manifest ||= if File.exist?(asset_file)
                      JSON.parse(File.read(asset_file))
                    end
    end
  end

  def self.hash_manifest(assets_prefix: '/assets')
    # Create a true manifest from rsbuild manifest
    @hash_manifest ||= manifest['allFiles']&.filter_map do |file|
      next if file.end_with?('.map')

      original_file = file
      original_file = original_file.delete_prefix("http://#{ENV['WEBSITE_ASSET']}")
      original_file = original_file.delete_prefix(assets_prefix) if assets_prefix
      original_file = original_file.delete_prefix('/javascripts/async/')
      original_file = original_file.delete_prefix('/javascripts/')
      original_file = original_file.delete_prefix('/stylesheets/async/')
      original_file = original_file.delete_prefix('/stylesheets/')
      original_file = original_file.delete_prefix('/fonts/')
      original_file = original_file.delete_prefix('/images/')

      original_filename, _hash, extension = original_file.match(/^(.*)\.(\w+?)\.(\w+)$/i)&.captures
      original_filename, extension        = original_file.match(/^(.*)\.(\w+)$/i)&.captures unless original_filename && extension

      original_filename && extension ? ["#{original_filename}.#{extension}", file] : nil
    end.to_h
  end

  def self.associated_javascripts(files, absolute_url: false)
    js_files = {
      initial:  [],
      original: []
    }

    files.each do |file|
      manifest.dig('entries', file, 'initial', 'js')&.each do |initial_file|
        next if initial_file.include?("/javascripts/#{file}.js")
        next if @loaded_files.include?(initial_file)

        @loaded_files << initial_file

        js_files[:initial] << javascript_path(initial_file, use_hash: false)
      end

      manifest.dig('entries', file, 'async', 'js')&.each do |async_file|
        next if async_file.include?("/javascripts/#{file}.js")
        next if async_file.include?('/async/')
        next if @loaded_files.include?(async_file)

        @loaded_files << async_file

        js_files[:initial] << javascript_path(async_file, use_hash: false)
      end

      js_files[:original] << if absolute_url
                               "http://#{ENV['WEBSITE_ASSET']}/javascripts/#{file}.js"
                             else
                               javascript_path(file)
                             end
    end

    @loaded_files = []

    return js_files
  end

  def self.javascript_path(url, use_hash: true)
    return unless url

    url += '.js' unless url.end_with?('.js')

    if use_hash
      url = url.delete_prefix('/javascripts/async/')
      url = url.delete_prefix('/javascripts/')
      url = hash_manifest[url.split('?')[0]]&.chomp('/') || url if hash_manifest
    end

    url = "#{root_url}/#{url.chomp('/')}" if Rails.env.production?

    return url
  end

  def self.stylesheet_path(url, use_hash: true)
    return unless url

    url += '.css' unless url.end_with?('.css')

    if use_hash
      url = url.delete_prefix('/stylesheets/async/')
      url = url.delete_prefix('/stylesheets/')
      url = hash_manifest[url.split('?')[0]]&.chomp('/') || url if hash_manifest
    end

    url = "#{root_url}/#{url.chomp('/')}" if Rails.env.production?

    return url
  end

  def self.image_path(url, exists: true)
    return unless url

    if url.start_with?('/uploads/')
      if Rails.env.development?
        if exists
          url
        else
          ENV['WEBSITE_ASSET_DISTANT'] + url
        end
      else
        ENV['WEBSITE_FULL_ASSET'] + url
      end
    elsif url.start_with?('data:')
      url
    elsif hash_manifest && url
      hash_manifest[url.split('?')[0]] || url
    else
      "#{root_url}/assets/#{url}"
    end
  end

  def self.asset_path(url)
    return unless url

    if hash_manifest && url
      hash_manifest[url.split('?')[0]] || url
    else
      "#{root_url}/assets/#{url}"
    end
  end

  def self.root_url
    if Rails.env.production?
      ENV['WEBSITE_ASSET']
    elsif Rails.env.test?
      "http://localhost:#{ENV['TEST_PORT']}/"
    else
      Rails.application.routes.url_helpers.root_url(host: ENV['WEBSITE_ASSET'], protocol: Rails.env.production? ? 'https' : 'http').chomp('/')
    end
  end
end
