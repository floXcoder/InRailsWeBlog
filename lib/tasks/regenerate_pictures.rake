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

    Ride.transaction do
      Ride.with_deleted.find_in_batches(batch_size: 200) do |rides|
        rides.each do |ride|
          ride.static_map.recreate_versions! if ride.static_map?
          ride.save!
        end
      end
    end

    Shop.transaction do
      Shop.with_deleted.find_in_batches(batch_size: 200) do |shops|
        shops.each do |shop|
          shop.static_map.recreate_versions! if shop.static_map?
          shop.save!
        end
      end
    end

  end
end
