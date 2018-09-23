# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:regenerate_pictures
  desc 'Regenerate uploaded pictures for all models'
  task regenerate_pictures: :environment do |_task, _args|

    Picture.transaction do
      Picture.with_deleted.find_in_batches(batch_size: 200) do |pictures|
        pictures.each do |picture|
          picture.image.recreate_versions! if picture.image?
          picture.save!
        end
      end
    end

  end
end
