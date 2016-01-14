class AssetManifest
  def self.manifest
    asset_file = Rails.root.join('public', 'assets', 'rev-manifest.json')
    if File.exists?(asset_file)
      @manifest ||= JSON.parse(File.read(asset_file))
    end
  end

  def self.stylesheet_path(url)
    return unless url

    if AssetManifest.manifest
      url += '.css' unless url.end_with?('.css')
      '/assets/' + (AssetManifest.manifest[url] || url)
    else
      '/assets/' + url
    end


  end

  def self.javascript_path(url)
    return unless url

    if AssetManifest.manifest
      url += '.js' unless url.end_with?('.js')
      '/assets/' + (AssetManifest.manifest[url] || url)
    else
      '/assets/' + url
    end
  end

  def self.image_path(url)
    return unless url

    if !url.start_with?('/uploads/')
      if AssetManifest.manifest
        '/assets/' + (AssetManifest.manifest[url] || url)
      else
        '/assets/' + url
      end
    else
      url
    end
  end

  def self.asset_path(url)
    return unless url

    if AssetManifest.manifest
      (AssetManifest.manifest[url] || url)
    else
      url
    end
  end
end
