# encoding: utf-8

class DataUploader < CarrierWave::Uploader::Base
  storage :file

  before :cache, :reset_secure_token
  before :cache, :save_original_filename

  # Override the directory where uploaded files will be stored.
  def store_dir
    klass    = model.class.to_s
    klass_id = model.id

    "uploads/#{klass.underscore}/#{mounted_as}/#{klass_id}"
  end

  # Add UUID to filenames to have unique name by file and for image caching
  def filename
    "#{File.basename(original_filename, '.*')}-#{secure_token(12)}.#{file.extension}" if original_filename.present?
  end

  # Add a white list of extensions which are allowed to be uploaded.
  def extension_whitelist
    %w[pdf]
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
