# frozen_string_literal: true

class Slug
  def self.regenerate
    User.all.find_in_batches(batch_size: 200) do |users|
      users.each do |user|
        user.slug = nil
        user.save!
      end
    end

    Topic.all.find_in_batches(batch_size: 200) do |topics|
      topics.each do |topic|
        topic.slug = nil
        topic.save!
      end
    end

    Tag.all.find_in_batches(batch_size: 200) do |tags|
      tags.each do |tag|
        tag.slug = nil
        tag.save!
      end
    end

    Article.all.find_in_batches(batch_size: 200) do |articles|
      articles.each do |article|
        article.set_friendly_id
        article.save!
      end
    end

    Admin.all.find_in_batches(batch_size: 200) do |admins|
      admins.each do |admin|
        admin.slug = nil
        admin.save!
      end
    end

    return true
  end
end
