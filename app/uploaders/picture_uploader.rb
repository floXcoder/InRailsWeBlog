# frozen_string_literal: true

class PictureUploader < CarrierWave::Uploader::Base
  include CarrierWave::Vips

  storage :file

  before :cache, :reset_secure_token
  before :cache, :save_original_filename

  resize_to_limit 2048, 2048
  process :optimize
  convert :jpg

  version :webp do
    convert(:webp)
  end

  version :medium do
    resize_to_limit 750, 750
    process :optimize

    version :webp do
      convert(:webp)
    end
  end

  version :mini, from_version: :medium do
    resize_to_limit 350, 350
    process :optimize

    version :webp do
      convert(:webp)
    end
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

  # Add UUID to filenames to have unique name by file and for image caching
  def filename
    # Extension must be jpg due to a carrierwave bug
    "#{File.basename(original_filename, '.*')}-#{secure_token(12)}.jpg" if original_filename.present?
  end

  # Add a white list of extensions which are allowed to be uploaded.
  def extension_allowlist
    %w[jpg jpeg gif png webp avif]
  end

  # Progressive JPEG
  def optimize
    vips! do |builder|
      builder.strip
      builder.quality '85'
      builder.depth '8'
      builder.interlace 'Plane'

      builder = yield(builder) if block_given?

      builder
    end
  end

  protected

  def save_original_filename(file)
    model.original_filename ||= file.original_filename if file.respond_to?(:original_filename)
  end

  def secure_token(length = 16)
    model.image_secure_token ||= SecureRandom.hex(length / 2)
  end

  def reset_secure_token(_file)
    model.image_secure_token = nil
  end
end
