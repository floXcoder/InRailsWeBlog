# frozen_string_literal: true

module MailerHelper
  def email_image_tag(image, **options)
    image_name = image
    if image.start_with?('/uploads')
      image_name              = image.split('/').last
      attachments[image_name] = File.read(Rails.root.join("public/#{image}")) if attachments[image_name].nil?
    elsif attachments[image_name].nil?
      attachments[image_name] = File.read(Rails.root.join("app/assets/images/#{image}"))
    end

    image_tag attachments[image_name].url, **options
  end

  # Transform image to base 64 (but not working with many gmail)
  # def base64_image(image, **options)
  #   image   = image.start_with?('/uploads') ? "public/#{image}" : "app/assets/images/#{image}"
  #   image64 = Base64.encode64 File.read(Rails.root.join(image))
  #
  #   image_tag "data:image/png;base64,#{image64}", **options
  # end
end
