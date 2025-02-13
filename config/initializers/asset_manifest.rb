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
    @hash_manifest ||= manifest&.dig('allFiles')&.filter_map do |file|
      next if file.end_with?('.map')

      original_file = file
      original_file = original_file.delete_prefix("#{Rails.env.production? ? 'https' : 'http'}://#{ENV['ASSETS_HOST']}")
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

  def self.associated_javascripts(file)
    js_file = javascript_path(file)

    associated_files = Rails.cache.fetch("assets-#{js_file.split('/').last}", expires_in: 1.day) do
      js_files = {
        initial:  [],
        original: []
      }

      manifest&.dig('entries', file, 'initial', 'js')&.each do |initial_file|
        next if initial_file.include?("/javascripts/#{file}.js")
        next if @loaded_files.include?(initial_file)
        next if manifest_javascript_file(file) && initial_file.include?(manifest_javascript_file(file))

        @loaded_files << initial_file

        js_files[:initial] << javascript_path(initial_file, use_hash: false)
      end

      # Manage initial file but present in async files
      # We need to read the generated file to get the correct initial files list
      js_content = URI.open(js_file, &:read) rescue nil if js_file.start_with?('http')
      required_initial_files = if js_content
                                 if Rails.env.development?
                                   JSON.parse(js_content[/O\(undefined, (\[.*\])/, 1]) rescue []
                                 else
                                   JSON.parse(js_content[/\(void 0,(\[.*\])/, 1]) rescue []
                                 end
                               else
                                 []
                               end

      manifest&.dig('entries', file, 'async', 'js')&.each do |async_file|
        next if async_file.include?("/javascripts/#{file}.js")
        next if async_file.include?('/async/')
        next if @loaded_files.include?(async_file)
        next if manifest_javascript_file(file) && async_file.include?(manifest_javascript_file(file))

        next if required_initial_files.present? && required_initial_files.none? { |initial| async_file.include?(initial) }

        @loaded_files << async_file

        js_files[:initial] << javascript_path(async_file, use_hash: false)
      end

      js_files[:original] << js_file

      js_files
    end

    @loaded_files = []

    return associated_files
  end

  def self.manifest_javascript_file(file)
    return nil unless hash_manifest
    return nil unless file

    file += '.js' unless file.end_with?('.js')

    file = file.delete_prefix('/javascripts/async/')
    file = file.delete_prefix('/javascripts/')
    file = hash_manifest[file.split('?')[0]]&.chomp('/') || file

    return file
  end

  def self.javascript_path(url, use_hash: true)
    return unless url

    url += '.js' unless url.end_with?('.js')

    if use_hash
      url = url.delete_prefix('/javascripts/async/')
      url = url.delete_prefix('/javascripts/')
      url = hash_manifest[url.split('?')[0]]&.chomp('/') || url if hash_manifest
    end

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

    return url
  end

  def self.image_path(url, exists: true, local: false)
    return unless url

    if local
      "/#{url}"
    elsif url.start_with?('/uploads/')
      if Rails.env.development?
        if exists
          url
        elsif ENV['ASSETS_URL_REMOTE'].present?
          ENV['ASSETS_URL_REMOTE'] + url
        end
      else
        "#{root_url}/#{url}"
      end
    elsif url.start_with?('data:')
      url
    elsif hash_manifest && url && hash_manifest[url.split('?')[0]]
      hash_manifest[url.split('?')[0]]
    else
      "#{root_url}/assets/#{url}"
    end
  end

  def self.asset_path(url)
    return unless url

    if hash_manifest && url && hash_manifest[url.split('?')[0]]
      hash_manifest[url.split('?')[0]]
    else
      "#{root_url}/assets/#{url}"
    end
  end

  def self.root_url
    if Rails.env.test?
      "http://localhost:#{ENV['TEST_PORT']}/"
    else
      Rails.application.routes.url_helpers.root_url(host: ENV['ASSETS_HOST'], protocol: Rails.env.production? ? 'https' : 'http').chomp('/')
    end
  end
end
