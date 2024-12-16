# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2024_12_15_154120) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pg_stat_statements"

  create_table "admin_blogs", force: :cascade do |t|
    t.bigint "admin_id", null: false
    t.integer "visibility", default: 0, null: false
    t.string "title", null: false
    t.text "content", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "admins", force: :cascade do |t|
    t.string "pseudo", default: "", null: false
    t.string "additional_info"
    t.string "locale", default: "en"
    t.jsonb "settings", default: {}, null: false
    t.string "slug"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
    t.index ["pseudo"], name: "index_admins_on_pseudo", unique: true
    t.index ["reset_password_token"], name: "index_admins_on_reset_password_token", unique: true
    t.index ["slug"], name: "index_admins_on_slug", unique: true
    t.index ["unlock_token"], name: "index_admins_on_unlock_token", unique: true
  end

  create_table "ahoy_events", force: :cascade do |t|
    t.bigint "visit_id"
    t.bigint "user_id"
    t.string "name"
    t.jsonb "properties"
    t.datetime "time", precision: nil
    t.index ["name", "time"], name: "index_ahoy_events_on_name_and_time"
    t.index ["user_id"], name: "index_ahoy_events_on_user_id"
    t.index ["visit_id"], name: "index_ahoy_events_on_visit_id"
  end

  create_table "ahoy_visits", force: :cascade do |t|
    t.string "visit_token"
    t.string "visitor_token"
    t.bigint "user_id"
    t.string "ip"
    t.text "user_agent"
    t.text "referrer"
    t.string "referring_domain"
    t.text "landing_page"
    t.text "takeoff_page"
    t.integer "events_count", default: 0
    t.integer "pages_count", default: 0
    t.string "browser"
    t.string "os"
    t.string "device_type"
    t.string "country"
    t.string "region"
    t.string "city"
    t.float "latitude"
    t.float "longitude"
    t.string "utm_source"
    t.string "utm_medium"
    t.string "utm_term"
    t.string "utm_content"
    t.string "utm_campaign"
    t.string "app_version"
    t.string "os_version"
    t.string "platform"
    t.datetime "started_at", precision: nil
    t.datetime "ended_at", precision: nil
    t.boolean "validated", default: false, null: false
    t.index ["visit_token"], name: "index_ahoy_visits_on_visit_token", unique: true
  end

  create_table "article_redirections", force: :cascade do |t|
    t.bigint "article_id", null: false
    t.string "previous_slug", null: false
    t.string "current_slug", null: false
    t.string "locale"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_article_redirections_on_article_id"
  end

  create_table "article_relationships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "parent_id", null: false
    t.bigint "child_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
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
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "contributor_id"
    t.jsonb "inventories", default: {}, null: false
    t.jsonb "slug"
    t.index ["topic_id", "visibility"], name: "index_articles_on_topic_id_and_visibility", where: "(deleted_at IS NULL)"
    t.index ["user_id", "visibility"], name: "index_articles_on_user_id_and_visibility", where: "(deleted_at IS NULL)"
    t.index ["visibility"], name: "index_articles_on_visibility", where: "(deleted_at IS NULL)"
  end

  create_table "bookmarks", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "bookmarked_type", null: false
    t.bigint "bookmarked_id", null: false
    t.boolean "follow", default: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "topic_id"
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
    t.datetime "deleted_at", precision: nil
    t.integer "parent_id"
    t.integer "lft"
    t.integer "rgt"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["commentable_id", "commentable_type"], name: "index_comments_on_commentable_id_and_commentable_type", where: "(deleted_at IS NULL)"
    t.index ["user_id"], name: "index_comments_on_user_id", where: "(deleted_at IS NULL)"
  end

  create_table "good_job_batches", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.jsonb "serialized_properties"
    t.text "on_finish"
    t.text "on_success"
    t.text "on_discard"
    t.text "callback_queue_name"
    t.integer "callback_priority"
    t.datetime "enqueued_at"
    t.datetime "discarded_at"
    t.datetime "finished_at"
    t.datetime "jobs_finished_at"
  end

  create_table "good_job_executions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "active_job_id", null: false
    t.text "job_class"
    t.text "queue_name"
    t.jsonb "serialized_params"
    t.datetime "scheduled_at"
    t.datetime "finished_at"
    t.text "error"
    t.integer "error_event", limit: 2
    t.text "error_backtrace", array: true
    t.uuid "process_id"
    t.interval "duration"
    t.index ["active_job_id", "created_at"], name: "index_good_job_executions_on_active_job_id_and_created_at"
    t.index ["process_id", "created_at"], name: "index_good_job_executions_on_process_id_and_created_at"
  end

  create_table "good_job_processes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "state"
    t.integer "lock_type", limit: 2
  end

  create_table "good_job_settings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "key"
    t.jsonb "value"
    t.index ["key"], name: "index_good_job_settings_on_key", unique: true
  end

  create_table "good_jobs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "queue_name"
    t.integer "priority"
    t.jsonb "serialized_params"
    t.datetime "scheduled_at"
    t.datetime "performed_at"
    t.datetime "finished_at"
    t.text "error"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "active_job_id"
    t.text "concurrency_key"
    t.text "cron_key"
    t.uuid "retried_good_job_id"
    t.datetime "cron_at"
    t.uuid "batch_id"
    t.uuid "batch_callback_id"
    t.boolean "is_discrete"
    t.integer "executions_count"
    t.text "job_class"
    t.integer "error_event", limit: 2
    t.text "labels", array: true
    t.uuid "locked_by_id"
    t.datetime "locked_at"
    t.index ["active_job_id", "created_at"], name: "index_good_jobs_on_active_job_id_and_created_at"
    t.index ["batch_callback_id"], name: "index_good_jobs_on_batch_callback_id", where: "(batch_callback_id IS NOT NULL)"
    t.index ["batch_id"], name: "index_good_jobs_on_batch_id", where: "(batch_id IS NOT NULL)"
    t.index ["concurrency_key"], name: "index_good_jobs_on_concurrency_key_when_unfinished", where: "(finished_at IS NULL)"
    t.index ["cron_key", "created_at"], name: "index_good_jobs_on_cron_key_and_created_at_cond", where: "(cron_key IS NOT NULL)"
    t.index ["cron_key", "cron_at"], name: "index_good_jobs_on_cron_key_and_cron_at_cond", unique: true, where: "(cron_key IS NOT NULL)"
    t.index ["finished_at"], name: "index_good_jobs_jobs_on_finished_at", where: "((retried_good_job_id IS NULL) AND (finished_at IS NOT NULL))"
    t.index ["labels"], name: "index_good_jobs_on_labels", where: "(labels IS NOT NULL)", using: :gin
    t.index ["locked_by_id"], name: "index_good_jobs_on_locked_by_id", where: "(locked_by_id IS NOT NULL)"
    t.index ["priority", "created_at"], name: "index_good_job_jobs_for_candidate_lookup", where: "(finished_at IS NULL)"
    t.index ["priority", "created_at"], name: "index_good_jobs_jobs_on_priority_created_at_when_unfinished", order: { priority: "DESC NULLS LAST" }, where: "(finished_at IS NULL)"
    t.index ["priority", "scheduled_at"], name: "index_good_jobs_on_priority_scheduled_at_unfinished_unlocked", where: "((finished_at IS NULL) AND (locked_by_id IS NULL))"
    t.index ["queue_name", "scheduled_at"], name: "index_good_jobs_on_queue_name_and_scheduled_at", where: "(finished_at IS NULL)"
    t.index ["scheduled_at"], name: "index_good_jobs_on_scheduled_at", where: "(finished_at IS NULL)"
  end

  create_table "outdated_articles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "article_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
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
    t.datetime "captured_at", precision: nil
    t.index ["database", "captured_at"], name: "index_pghero_query_stats_on_database_and_captured_at"
  end

  create_table "pghero_space_stats", force: :cascade do |t|
    t.text "database"
    t.text "schema"
    t.text "relation"
    t.bigint "size"
    t.datetime "captured_at", precision: nil
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
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["imageable_id", "imageable_type"], name: "index_pictures_on_imageable_id_and_imageable_type", where: "(deleted_at IS NULL)"
  end

  create_table "seo_datas", force: :cascade do |t|
    t.string "name", null: false
    t.string "locale", null: false
    t.string "parameters", default: [], null: false, array: true
    t.jsonb "page_title", null: false
    t.jsonb "meta_desc", null: false
    t.string "languages", default: [], null: false, array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "settings", force: :cascade do |t|
    t.string "name", null: false
    t.text "value"
    t.integer "value_type", default: 0, null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["name", "value"], name: "index_settings_on_name_and_value", unique: true
  end

  create_table "shares", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "shareable_type", null: false
    t.bigint "shareable_id", null: false
    t.bigint "contributor_id"
    t.integer "mode", default: 0, null: false
    t.string "public_link"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["user_id", "shareable_id", "shareable_type"], name: "index_user_and_shares_uniqueness", unique: true
  end

  create_table "tag_relationships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "topic_id", null: false
    t.bigint "article_id", null: false
    t.bigint "parent_id", null: false
    t.bigint "child_id", null: false
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
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
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
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
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
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
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["name", "topic_id"], name: "index_topic_inventory_fields_on_name_and_topic_id", unique: true
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
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.jsonb "settings", default: {}, null: false
    t.integer "mode", default: 0, null: false
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
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "visits_count", default: 0, null: false
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
    t.string "locale", default: "en"
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
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at", precision: nil
    t.datetime "confirmation_sent_at", precision: nil
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at", precision: nil
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
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
    t.datetime "created_at", precision: nil
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  create_table "votes", force: :cascade do |t|
    t.string "voteable_type", null: false
    t.bigint "voteable_id", null: false
    t.string "voter_type"
    t.bigint "voter_id"
    t.boolean "vote", default: false, null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
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
