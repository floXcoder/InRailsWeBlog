# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_03_185035) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_stat_statements"
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.string "trackable_type"
    t.bigint "trackable_id"
    t.string "owner_type"
    t.bigint "owner_id"
    t.string "key"
    t.text "parameters"
    t.string "recipient_type"
    t.bigint "recipient_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id", "owner_type"], name: "index_activities_on_owner_id_and_owner_type"
    t.index ["recipient_id", "recipient_type"], name: "index_activities_on_recipient_id_and_recipient_type"
    t.index ["trackable_id", "trackable_type"], name: "index_activities_on_trackable_id_and_trackable_type"
  end

  create_table "admin_blogs", force: :cascade do |t|
    t.bigint "admin_id", null: false
    t.integer "visibility", default: 0, null: false
    t.string "title", null: false
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["admin_id", "visibility"], name: "index_admin_blogs_on_admin_id_and_visibility"
  end

  create_table "admins", force: :cascade do |t|
    t.string "pseudo", default: "", null: false
    t.string "additional_info"
    t.string "locale", default: "fr"
    t.jsonb "settings", default: {}, null: false
    t.string "slug"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
    t.index ["pseudo", "email"], name: "index_admins_on_pseudo_and_email"
    t.index ["pseudo"], name: "index_admins_on_pseudo", unique: true
    t.index ["reset_password_token"], name: "index_admins_on_reset_password_token", unique: true
    t.index ["slug"], name: "index_admins_on_slug", unique: true
    t.index ["unlock_token"], name: "index_admins_on_unlock_token", unique: true
  end

  create_table "article_relationships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "parent_id", null: false
    t.bigint "child_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "parent_id", "child_id"], name: "index_article_relationship_uniqueness", unique: true
  end

  create_table "articles", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "topic_id"
    t.integer "mode", default: 0, null: false
    t.jsonb "title_translations", default: {}
    t.jsonb "summary_translations", default: {}
    t.jsonb "content_translations", default: {}, null: false
    t.string "languages", default: [], null: false, array: true
    t.text "reference"
    t.boolean "draft", default: false, null: false
    t.integer "notation", default: 0
    t.integer "priority", default: 0
    t.integer "visibility", default: 0, null: false
    t.boolean "accepted", default: true, null: false
    t.boolean "archived", default: false, null: false
    t.boolean "allow_comment", default: true, null: false
    t.integer "pictures_count", default: 0
    t.integer "outdated_articles_count", default: 0
    t.integer "bookmarks_count", default: 0
    t.integer "comments_count", default: 0
    t.string "slug"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "contributor_id"
    t.jsonb "inventories", default: {}, null: false
    t.index ["contributor_id"], name: "index_articles_on_contributor_id"
    t.index ["deleted_at"], name: "index_articles_on_deleted_at"
    t.index ["slug"], name: "index_articles_on_slug", unique: true, where: "(deleted_at IS NULL)"
    t.index ["topic_id", "visibility"], name: "index_articles_on_topic_id_and_visibility", where: "(deleted_at IS NULL)"
    t.index ["user_id", "visibility"], name: "index_articles_on_user_id_and_visibility", where: "(deleted_at IS NULL)"
  end

  create_table "bookmarks", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "bookmarked_type", null: false
    t.bigint "bookmarked_id", null: false
    t.boolean "follow", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "topic_id"
    t.index ["bookmarked_id", "bookmarked_type"], name: "index_bookmarks_on_bookmarked_id_and_bookmarked_type"
    t.index ["topic_id"], name: "index_bookmarks_on_topic_id"
    t.index ["user_id", "bookmarked_id", "bookmarked_type"], name: "index_user_and_bookmarks_uniqueness", unique: true
  end

  create_table "comments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "commentable_type", null: false
    t.bigint "commentable_id", null: false
    t.string "title"
    t.string "subject"
    t.text "body"
    t.integer "rating", default: 0
    t.integer "positive_reviews", default: 0
    t.integer "negative_reviews", default: 0
    t.boolean "accepted", default: true, null: false
    t.boolean "ask_for_deletion", default: false, null: false
    t.datetime "deleted_at"
    t.integer "parent_id"
    t.integer "lft"
    t.integer "rgt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["commentable_id", "commentable_type"], name: "index_comments_on_commentable_id_and_commentable_type", where: "(deleted_at IS NULL)"
    t.index ["parent_id"], name: "index_comments_on_parent_id"
    t.index ["user_id"], name: "index_comments_on_user_id", where: "(deleted_at IS NULL)"
  end

  create_table "outdated_articles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "article_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id", "user_id"], name: "index_outdated_articles_on_article_id_and_user_id", unique: true
    t.index ["user_id"], name: "index_outdated_articles_on_user_id"
  end

  create_table "pghero_query_stats", force: :cascade do |t|
    t.text "database"
    t.text "user"
    t.text "query"
    t.bigint "query_hash"
    t.float "total_time"
    t.bigint "calls"
    t.datetime "captured_at"
    t.index ["database", "captured_at"], name: "index_pghero_query_stats_on_database_and_captured_at"
  end

  create_table "pghero_space_stats", force: :cascade do |t|
    t.text "database"
    t.text "schema"
    t.text "relation"
    t.bigint "size"
    t.datetime "captured_at"
    t.index ["database", "captured_at"], name: "index_pghero_space_stats_on_database_and_captured_at"
  end

  create_table "pictures", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "imageable_id"
    t.string "imageable_type", null: false
    t.string "image"
    t.string "image_tmp"
    t.text "description"
    t.string "copyright"
    t.string "original_filename"
    t.string "image_secure_token"
    t.integer "priority", default: 0, null: false
    t.boolean "accepted", default: true, null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_pictures_on_deleted_at"
    t.index ["imageable_id", "imageable_type"], name: "index_pictures_on_imageable_id_and_imageable_type", where: "(deleted_at IS NULL)"
    t.index ["user_id"], name: "index_pictures_on_user_id", where: "(deleted_at IS NULL)"
  end

  create_table "seo_datas", force: :cascade do |t|
    t.string "name", null: false
    t.string "locale", null: false
    t.string "parameters", default: [], null: false, array: true
    t.jsonb "page_title", null: false
    t.jsonb "meta_desc", null: false
    t.string "languages", default: [], null: false, array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "settings", force: :cascade do |t|
    t.string "name", null: false
    t.text "value"
    t.integer "value_type", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "value"], name: "index_settings_on_name_and_value", unique: true
  end

  create_table "shares", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "shareable_type", null: false
    t.bigint "shareable_id", null: false
    t.bigint "contributor_id"
    t.integer "mode", default: 0, null: false
    t.string "public_link"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contributor_id"], name: "index_shares_on_contributor_id"
    t.index ["shareable_id", "shareable_type"], name: "index_shares_on_shareable_id_and_shareable_type"
    t.index ["user_id", "shareable_id", "shareable_type"], name: "index_user_and_shares_uniqueness", unique: true
  end

  create_table "tag_relationships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "topic_id", null: false
    t.bigint "article_id", null: false
    t.bigint "parent_id", null: false
    t.bigint "child_id", null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_tag_relationships_on_deleted_at"
    t.index ["user_id", "topic_id"], name: "index_tag_relationships_on_user_id_and_topic_id", where: "(deleted_at IS NULL)"
  end

  create_table "tagged_articles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "topic_id", null: false
    t.bigint "tag_id", null: false
    t.bigint "article_id", null: false
    t.boolean "parent", default: false, null: false
    t.boolean "child", default: false, null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id", "tag_id"], name: "index_tagged_articles_on_article_id_and_tag_id", unique: true, where: "(deleted_at IS NULL)"
    t.index ["article_id"], name: "index_tagged_articles_on_article_id", where: "(deleted_at IS NULL)"
    t.index ["deleted_at"], name: "index_tagged_articles_on_deleted_at"
    t.index ["tag_id"], name: "index_tagged_articles_on_tag_id", where: "(deleted_at IS NULL)"
    t.index ["topic_id"], name: "index_tagged_articles_on_topic_id", where: "(deleted_at IS NULL)"
    t.index ["user_id"], name: "index_tagged_articles_on_user_id", where: "(deleted_at IS NULL)"
  end

  create_table "tags", force: :cascade do |t|
    t.bigint "user_id"
    t.string "name", null: false
    t.jsonb "description_translations", default: {}
    t.string "languages", default: [], array: true
    t.string "synonyms", default: [], array: true
    t.string "color"
    t.integer "notation", default: 0
    t.integer "priority", default: 0
    t.integer "visibility", default: 0, null: false
    t.boolean "accepted", default: true, null: false
    t.boolean "archived", default: false, null: false
    t.boolean "allow_comment", default: true, null: false
    t.integer "pictures_count", default: 0
    t.integer "tagged_articles_count", default: 0
    t.integer "bookmarks_count", default: 0
    t.integer "comments_count", default: 0
    t.string "slug"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_tags_on_deleted_at"
    t.index ["slug"], name: "index_tags_on_slug", unique: true, where: "(deleted_at IS NULL)"
    t.index ["user_id", "visibility"], name: "index_tags_on_user_id_and_visibility", where: "(deleted_at IS NULL)"
  end

  create_table "topic_inventory_fields", force: :cascade do |t|
    t.bigint "topic_id"
    t.string "name", null: false
    t.string "field_name", null: false
    t.integer "value_type", default: 0, null: false
    t.string "parent_category"
    t.boolean "required", default: false, null: false
    t.boolean "searchable", default: false, null: false
    t.boolean "filterable", default: false, null: false
    t.integer "priority", default: 0, null: false
    t.integer "visibility", default: 0, null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_topic_inventory_fields_on_deleted_at"
    t.index ["name", "topic_id"], name: "index_topic_inventory_fields_on_name_and_topic_id", unique: true
    t.index ["topic_id"], name: "index_topic_inventory_fields_on_topic_id", where: "(deleted_at IS NULL)"
  end

  create_table "topics", force: :cascade do |t|
    t.bigint "user_id"
    t.string "name", null: false
    t.jsonb "description_translations", default: {}
    t.string "languages", default: [], array: true
    t.string "color"
    t.integer "priority", default: 0, null: false
    t.integer "visibility", default: 0, null: false
    t.boolean "accepted", default: true, null: false
    t.boolean "archived", default: false, null: false
    t.integer "pictures_count", default: 0
    t.integer "articles_count", default: 0
    t.integer "bookmarks_count", default: 0
    t.string "slug"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "settings", default: {}, null: false
    t.integer "mode", default: 0, null: false
    t.index ["deleted_at"], name: "index_topics_on_deleted_at"
    t.index ["name", "user_id"], name: "index_topics_on_name_and_user_id", unique: true
    t.index ["slug", "user_id"], name: "index_topics_on_slug_and_user_id", unique: true, where: "(deleted_at IS NULL)"
    t.index ["user_id"], name: "index_topics_on_user_id", where: "(deleted_at IS NULL)"
  end

  create_table "trackers", force: :cascade do |t|
    t.string "tracked_type", null: false
    t.bigint "tracked_id", null: false
    t.integer "views_count", default: 0, null: false
    t.integer "queries_count", default: 0, null: false
    t.integer "searches_count", default: 0, null: false
    t.integer "clicks_count", default: 0, null: false
    t.integer "popularity", default: 0, null: false
    t.integer "rank", default: 0, null: false
    t.boolean "home_page", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tracked_id", "tracked_type"], name: "index_trackers_on_tracked_id_and_tracked_type"
  end

  create_table "users", force: :cascade do |t|
    t.string "pseudo", default: "", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "street"
    t.string "city"
    t.string "postcode"
    t.string "state"
    t.string "country"
    t.string "mobile_number"
    t.string "phone_number"
    t.string "additional_info"
    t.date "birth_date"
    t.string "locale", default: "fr"
    t.jsonb "settings", default: {}, null: false
    t.boolean "allow_comment", default: true, null: false
    t.integer "visibility", default: 0, null: false
    t.integer "current_topic_id"
    t.integer "pictures_count", default: 0
    t.integer "topics_count", default: 0
    t.integer "articles_count", default: 0
    t.integer "tags_count", default: 0
    t.integer "bookmarks_count", default: 0
    t.integer "comments_count", default: 0
    t.string "slug"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["pseudo"], name: "index_users_on_pseudo", where: "(deleted_at IS NULL)"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["slug"], name: "index_users_on_slug", unique: true, where: "(deleted_at IS NULL)"
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  create_table "versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.string "locale"
    t.text "object"
    t.text "object_changes"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  create_table "votes", force: :cascade do |t|
    t.string "voteable_type", null: false
    t.bigint "voteable_id", null: false
    t.string "voter_type"
    t.bigint "voter_id"
    t.boolean "vote", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["voteable_id", "voteable_type"], name: "index_votes_on_voteable_id_and_voteable_type"
    t.index ["voteable_type", "voteable_id"], name: "index_votes_on_voteable_type_and_voteable_id"
    t.index ["voter_id", "voter_type", "voteable_id", "voteable_type"], name: "fk_one_vote_per_user_per_entity", unique: true
    t.index ["voter_type", "voter_id"], name: "index_votes_on_voter_type_and_voter_id"
  end

  add_foreign_key "admin_blogs", "admins"
  add_foreign_key "article_relationships", "articles", column: "child_id"
  add_foreign_key "article_relationships", "articles", column: "parent_id"
  add_foreign_key "article_relationships", "users"
  add_foreign_key "articles", "topics"
  add_foreign_key "articles", "users"
  add_foreign_key "bookmarks", "users"
  add_foreign_key "comments", "users"
  add_foreign_key "outdated_articles", "articles"
  add_foreign_key "outdated_articles", "users"
  add_foreign_key "pictures", "users"
  add_foreign_key "shares", "users"
  add_foreign_key "tag_relationships", "articles"
  add_foreign_key "tag_relationships", "tags", column: "child_id"
  add_foreign_key "tag_relationships", "tags", column: "parent_id"
  add_foreign_key "tag_relationships", "topics"
  add_foreign_key "tag_relationships", "users"
  add_foreign_key "tagged_articles", "articles"
  add_foreign_key "tagged_articles", "tags"
  add_foreign_key "tagged_articles", "topics"
  add_foreign_key "tagged_articles", "users"
  add_foreign_key "tags", "users"
  add_foreign_key "topic_inventory_fields", "topics"
  add_foreign_key "topics", "users"
end
