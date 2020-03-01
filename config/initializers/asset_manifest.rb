# frozen_string_literal: true

class AssetManifest
  def self.manifest
    asset_file = Rails.root.join('public', 'assets', 'manifest.json')
    if File.exist?(asset_file)
      @manifest ||= JSON.parse(File.read(asset_file))
    end
  end

  def self.stylesheet_path(url)
    return unless url

    if AssetManifest.manifest
      url += '.css' unless url.end_with?('.css')
      AssetManifest.manifest[url] || url
    else
      '/assets/' + url
    end
  end

  def self.javascript_path(url)
    return unless url

    if AssetManifest.manifest
      url += '.js' unless url.end_with?('.js')
      AssetManifest.manifest[url] || url
    else
      '/assets/' + url
    end
  end

  def self.image_path(url)
    return unless url

    if url.start_with?('/uploads/')
      if Rails.env.development?
        url
      else
        AssetManifest.root_url + url
      end
    else
      if AssetManifest.manifest
        AssetManifest.manifest[url] || url
      else
        AssetManifest.root_url + 'assets/' + url
      end
    end
  end

  def self.asset_path(url)
    return unless url

    if AssetManifest.manifest
      AssetManifest.manifest[url] || url
    else
      AssetManifest.root_url + url
    end
  end

  def self.root_url
    (Rails.env.production? ? ENV['WEBSITE_FULL_ADDRESS'] : Rails.application.routes.url_helpers.root_url(host: ENV['WEBSITE_ADDRESS']))
  end
end
