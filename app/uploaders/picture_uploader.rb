# encoding: utf-8

class PictureUploader < CarrierWave::Uploader::Base
  include ::CarrierWave::Backgrounder::Delay

  include CarrierWave::MiniMagick
  storage :file

  before :cache, :reset_secure_token
  before :cache, :save_original_filename

  process resize_to_fit: [1200, 800]
  process :optimize

  version :thumb do
    process resize_to_fit: [300, 300]
    process :optimize
  end

  # Override the directory where uploaded files will be stored.
  def store_dir
    klass    = model.class.to_s
    klass_id = model.id

    if klass == 'Picture'
      klass = model.imageable_type.to_s

      "uploads/#{klass.underscore}/pictures/#{klass_id}"
    else
      "uploads/#{klass.underscore}/#{mounted_as}/#{klass_id}"
    end
  end

  # Add UUID to filenames to have unique name by file and for image caching
  def filename
    "#{File.basename(original_filename, '.*')}-#{secure_token(12)}.#{file.extension}" if original_filename.present?
  end

  # Add a white list of extensions which are allowed to be uploaded.
  def extension_white_list
    %w(jpg jpeg gif png)
  end

  # Progressive JPEG
  def optimize
    manipulate! do |image|
      image.combine_options do |combine|
        combine.strip
        combine.quality '85'
        combine.depth '8'
        combine.interlace 'Plane'
      end
      image
    end
  end

  protected

  def save_original_filename(file)
    model.original_filename ||= file.original_filename if file.respond_to?(:original_filename)
  end

  def secure_token(length = 16)
    model.image_secure_token ||= SecureRandom.hex(length / 2)
  end

  def reset_secure_token(file)
    model.image_secure_token = nil
  end
end
