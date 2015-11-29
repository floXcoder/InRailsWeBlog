# encoding: utf-8

class PictureUploader < CarrierWave::Uploader::Base
  include ::CarrierWave::Backgrounder::Delay

  include CarrierWave::MiniMagick
  storage :file

  process convert: 'png', resize_to_limit: [1200, 800]

  version :thumb do
    process resize_to_fill: [200, 200]
    process convert: 'png'
  end

  # Override the directory where uploaded files will be stored.
  def store_dir
    klass    = model.class.to_s
    klass_id = model.id

    if klass == 'Picture'
      klass    = model.imageable_type.to_s
      klass_id = model.imageable_id
    end

    "uploads/#{klass.underscore}/#{mounted_as}/#{klass_id}"
  end

  # Add a white list of extensions which are allowed to be uploaded.
  def extension_white_list
    %w(jpg jpeg gif png)
  end

  # Change
  def filename
    super.chomp(File.extname(super)) + '.png'
  end

end
