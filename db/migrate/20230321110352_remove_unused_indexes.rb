class RemoveUnusedIndexes < ActiveRecord::Migration[7.0]
  def change
    remove_index :users, name: 'index_users_on_pseudo'

    remove_index :tags, name: 'index_tags_on_deleted_at'

    remove_index :topics, name: 'index_topics_on_deleted_at'

    remove_index :topic_inventory_fields, name: 'index_topic_inventory_fields_on_deleted_at'
    remove_index :topic_inventory_fields, name: 'index_topic_inventory_fields_on_topic_id'

    remove_index :ahoy_events, name: 'index_ahoy_events_on_properties'
    remove_index :ahoy_visits, name: 'index_ahoy_visits_on_user_id'

    remove_index :articles, name: 'index_articles_on_slug_en'
    remove_index :articles, name: 'index_articles_on_slug_fr'
    remove_index :articles, name: 'index_articles_on_slug_de'
    remove_index :articles, name: 'index_articles_on_slug_es'
    remove_index :articles, name: 'index_articles_on_slug_it'
    remove_index :articles, name: 'index_articles_on_contributor_id'
    remove_index :articles, name: 'index_articles_on_deleted_at'

    remove_index :pictures, name: 'index_pictures_on_deleted_at'
    remove_index :pictures, name: 'index_pictures_on_user_id'

    remove_index :versions, name: 'index_versions_on_item_id'

    remove_index :bookmarks, name: 'index_bookmarks_on_bookmarked_id_and_bookmarked_type'
    remove_index :bookmarks, name: 'index_bookmarks_on_topic_id'

    remove_index :comments, name: 'index_comments_on_parent_id'

    remove_index :shares, name: 'index_shares_on_contributor_id'
    remove_index :shares, name: 'index_shares_on_shareable_id_and_shareable_type'

    remove_index :votes, name: 'index_votes_on_voteable_id_and_voteable_type'

    remove_index :admins, name: 'index_admins_on_pseudo_and_email'
    remove_index :admin_blogs, name: 'index_admin_blogs_on_admin_id_and_visibility'
  end
end
