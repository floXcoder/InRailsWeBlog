class OptimizeIndexes < ActiveRecord::Migration[6.0]
  def change
    remove_index :admin_blogs, name: "index_admin_blogs_on_admin_id"
    remove_index :article_relationships, name: "index_article_relationships_on_user_id"
    remove_index :bookmarks, name: "index_bookmarks_on_user_id"
    remove_index :outdated_articles, name: "index_outdated_articles_on_article_id"
    remove_index :shares, name: "index_shares_on_user_id"
    remove_index :votes, name: "index_votes_on_voter_id_and_voter_type"
  end
end
