# frozen_string_literal: true

class AssetManifest
  def self.manifest
    asset_file = Rails.root.join('public/assets/manifest.json')
    if File.exist?(asset_file)
      @manifest ||= JSON.parse(File.read(asset_file))
    end
  end

  def self.stylesheet_path(url)
    return unless url

    url += '.css' unless url.end_with?('.css')
    if AssetManifest.manifest
      AssetManifest.manifest[url] || url
    else
      "#{AssetManifest.root_url}assets/#{url}"
    end
  end

  def self.javascript_path(url)
    return unless url

    url += '.js' unless url.end_with?('.js')
    if AssetManifest.manifest
      AssetManifest.manifest[url] || url
    else
      "#{AssetManifest.root_url}assets/#{url}"
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
    elsif url.start_with?('data:')
      url
    else
      if AssetManifest.manifest
        AssetManifest.manifest[url] || url
      else
        "#{AssetManifest.root_url}assets/#{url}"
      end
    end
  end

  def self.asset_path(url)
    return unless url

    if AssetManifest.manifest
      AssetManifest.manifest[url] || url
    else
      "#{AssetManifest.root_url}assets/#{url}"
    end
  end

  def self.root_url
    if Rails.env.production?
      "https://#{ENV['WEBSITE_ASSET']}"
    elsif Rails.env.test?
      "http://localhost:#{ENV['TEST_PORT']}"
    else
      Rails.application.routes.url_helpers.root_url(host: ENV['WEBSITE_ASSET'])
    end
  end
end
