class TagCompleteSerializer < ActiveModel::Serializer
  cache key: 'tag_complete', expires_in: CONFIG.cache_time

  attributes :id,
             :name,
             :description,
             :synonyms,
             :priority,
             :visibility,
             :visibility_translated,
             :tagged_articles_count,
             :slug,
             :parents,
             :children,
             :views_count,
             :clicks_count,
             :searches_count

  belongs_to :user, serializer: UserSampleSerializer

  def visibility_translated
    object.visibility_to_tr
  end

  def parents
    object.parents_for_user(instance_options[:current_user_id])
  end

  def children
    object.children_for_user(instance_options[:current_user_id])
  end

  def views_count
    object.tracker.views_count
  end

  def clicks_count
    object.tracker.clicks_count
  end

  def searches_count
    object.tracker.searches_count
  end
end
