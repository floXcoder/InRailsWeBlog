# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160623210717) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.integer  "trackable_id"
    t.string   "trackable_type"
    t.integer  "owner_id"
    t.string   "owner_type"
    t.string   "key"
    t.text     "parameters"
    t.integer  "recipient_id"
    t.string   "recipient_type"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  add_index "activities", ["owner_id", "owner_type"], name: "index_activities_on_owner_id_and_owner_type", using: :btree
  add_index "activities", ["recipient_id", "recipient_type"], name: "index_activities_on_recipient_id_and_recipient_type", using: :btree
  add_index "activities", ["trackable_id", "trackable_type"], name: "index_activities_on_trackable_id_and_trackable_type", using: :btree

  create_table "articles", force: :cascade do |t|
    t.integer  "author_id",                                 null: false
    t.integer  "topic_id",                                  null: false
    t.string   "title",                     default: ""
    t.text     "summary",                   default: ""
    t.text     "content",                   default: "",    null: false
    t.boolean  "private_content",           default: false, null: false
    t.boolean  "is_link",                   default: false, null: false
    t.text     "reference"
    t.boolean  "draft",                 default: false, null: false
    t.string   "language"
    t.boolean  "allow_comment",             default: true,  null: false
    t.integer  "notation",                  default: 0
    t.integer  "priority",                  default: 0
    t.integer  "visibility",                default: 0,     null: false
    t.boolean  "archived",                  default: false, null: false
    t.boolean  "accepted",                  default: true,  null: false
    t.integer  "bookmarked_articles_count", default: 0
    t.integer  "outdated_articles_count",   default: 0
    t.string   "slug"
    t.datetime "deleted_at"
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
  end

  add_index "articles", ["author_id", "visibility"], name: "index_articles_on_author_id_and_visibility", where: "(deleted_at IS NULL)", using: :btree
  add_index "articles", ["slug"], name: "index_articles_on_slug", unique: true, where: "(deleted_at IS NULL)", using: :btree
  add_index "articles", ["topic_id", "visibility"], name: "index_articles_on_topic_id_and_visibility", where: "(deleted_at IS NULL)", using: :btree

  create_table "bookmarked_articles", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "article_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "bookmarked_articles", ["article_id"], name: "index_bookmarked_articles_on_article_id", using: :btree
  add_index "bookmarked_articles", ["user_id", "article_id"], name: "index_bookmarked_articles_on_user_id_and_article_id", unique: true, using: :btree
  add_index "bookmarked_articles", ["user_id"], name: "index_bookmarked_articles_on_user_id", using: :btree

  create_table "comments", force: :cascade do |t|
    t.integer  "commentable_id",                  null: false
    t.string   "commentable_type",                null: false
    t.integer  "user_id",                         null: false
    t.string   "title"
    t.text     "body"
    t.string   "subject"
    t.integer  "rating",           default: 0
    t.integer  "positive_reviews", default: 0
    t.integer  "negative_reviews", default: 0
    t.boolean  "accepted",         default: true, null: false
    t.datetime "deleted_at"
    t.integer  "parent_id"
    t.integer  "lft"
    t.integer  "rgt"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  add_index "comments", ["commentable_id", "commentable_type"], name: "index_comments_on_commentable_id_and_commentable_type", where: "(deleted_at IS NULL)", using: :btree
  add_index "comments", ["parent_id"], name: "index_comments_on_parent_id", where: "(deleted_at IS NULL)", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", where: "(deleted_at IS NULL)", using: :btree

  create_table "error_messages", force: :cascade do |t|
    t.text     "class_name"
    t.text     "message"
    t.text     "trace"
    t.text     "line_number"
    t.text     "column_number"
    t.text     "params"
    t.text     "target_url"
    t.text     "referer_url"
    t.text     "user_agent"
    t.string   "user_info"
    t.string   "app_name"
    t.string   "doc_root"
    t.string   "ip"
    t.integer  "origin",        default: 0, null: false
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "outdated_articles", force: :cascade do |t|
    t.integer  "article_id", null: false
    t.integer  "user_id",    null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "outdated_articles", ["article_id", "user_id"], name: "index_outdated_articles_on_article_id_and_user_id", unique: true, using: :btree
  add_index "outdated_articles", ["article_id"], name: "index_outdated_articles_on_article_id", using: :btree
  add_index "outdated_articles", ["user_id"], name: "index_outdated_articles_on_user_id", using: :btree

  create_table "pictures", force: :cascade do |t|
    t.integer  "imageable_id",                  null: false
    t.string   "imageable_type",                null: false
    t.string   "image"
    t.string   "image_tmp"
    t.integer  "priority",       default: 0,    null: false
    t.boolean  "accepted",       default: true, null: false
    t.datetime "deleted_at"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  add_index "pictures", ["deleted_at"], name: "index_pictures_on_deleted_at", using: :btree
  add_index "pictures", ["imageable_id", "imageable_type"], name: "index_pictures_on_imageable_id_and_imageable_type", where: "(deleted_at IS NULL)", using: :btree

  create_table "tag_relationships", force: :cascade do |t|
    t.integer  "parent_id",   null: false
    t.integer  "child_id",    null: false
    t.string   "article_ids", null: false, array: true
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "tag_relationships", ["parent_id", "child_id"], name: "index_tag_relationships_on_parent_id_and_child_id", unique: true, using: :btree

  create_table "tagged_articles", force: :cascade do |t|
    t.integer  "article_id",                 null: false
    t.integer  "tag_id",                     null: false
    t.boolean  "parent",     default: false, null: false
    t.boolean  "child",      default: false, null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "tagged_articles", ["article_id", "tag_id"], name: "index_tagged_articles_on_article_id_and_tag_id", unique: true, using: :btree
  add_index "tagged_articles", ["article_id"], name: "index_tagged_articles_on_article_id", using: :btree
  add_index "tagged_articles", ["tag_id"], name: "index_tagged_articles_on_tag_id", using: :btree

  create_table "tagged_topics", force: :cascade do |t|
    t.integer  "topic_id",   null: false
    t.integer  "user_id",    null: false
    t.integer  "tag_id",     null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "tagged_topics", ["tag_id"], name: "index_tagged_topics_on_tag_id", using: :btree
  add_index "tagged_topics", ["topic_id", "user_id", "tag_id"], name: "index_tagged_topics_on_topic_id_and_user_id_and_tag_id", unique: true, using: :btree
  add_index "tagged_topics", ["topic_id"], name: "index_tagged_topics_on_topic_id", using: :btree
  add_index "tagged_topics", ["user_id"], name: "index_tagged_topics_on_user_id", using: :btree

  create_table "tags", force: :cascade do |t|
    t.integer  "user_id",                             null: false
    t.string   "name",                                  null: false
    t.text     "description"
    t.string   "synonyms",              default: [],                 array: true
    t.string   "color"
    t.integer  "priority",              default: 0,     null: false
    t.integer  "visibility",            default: 0,     null: false
    t.boolean  "archived",              default: false, null: false
    t.boolean  "accepted",              default: true,  null: false
    t.integer  "tagged_articles_count", default: 0
    t.string   "slug"
    t.datetime "deleted_at"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
  end

  add_index "tags", ["name", "user_id"], name: "index_tags_on_name_and_user_id", unique: true, where: "(visibility = 1)", using: :btree
  add_index "tags", ["name"], name: "index_tags_on_name", unique: true, where: "(visibility = 0)", using: :btree
  add_index "tags", ["slug"], name: "index_tags_on_slug", unique: true, where: "(deleted_at IS NULL)", using: :btree
  add_index "tags", ["user_id"], name: "index_tags_on_user_id", where: "(deleted_at IS NULL)", using: :btree

  create_table "topics", force: :cascade do |t|
    t.integer  "user_id",                     null: false
    t.string   "name",                        null: false
    t.text     "description"
    t.string   "color"
    t.integer  "priority",    default: 0,     null: false
    t.integer  "visibility",  default: 0,     null: false
    t.boolean  "archived",    default: false, null: false
    t.boolean  "accepted",    default: true,  null: false
    t.string   "slug"
    t.datetime "deleted_at"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  add_index "topics", ["name", "user_id"], name: "index_topics_on_name_and_user_id", unique: true, using: :btree
  add_index "topics", ["slug"], name: "index_topics_on_slug", unique: true, where: "(deleted_at IS NULL)", using: :btree
  add_index "topics", ["user_id"], name: "index_topics_on_user_id", where: "(deleted_at IS NULL)", using: :btree

  create_table "trackers", force: :cascade do |t|
    t.integer  "tracked_id",                      null: false
    t.string   "tracked_type",                    null: false
    t.integer  "views_count",     default: 0,     null: false
    t.integer  "queries_count",   default: 0,     null: false
    t.integer  "searches_count",  default: 0,     null: false
    t.integer  "comments_count",  default: 0,     null: false
    t.integer  "clicks_count",    default: 0,     null: false
    t.integer  "bookmarks_count", default: 0,     null: false
    t.integer  "rank",            default: 0,     null: false
    t.boolean  "home_page",       default: false, null: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  add_index "trackers", ["tracked_id", "tracked_type"], name: "index_trackers_on_tracked_id_and_tracked_type", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "pseudo",                 default: "",    null: false
    t.string   "first_name",             default: ""
    t.string   "last_name",              default: ""
    t.integer  "age",                    default: 0
    t.string   "city",                   default: ""
    t.string   "country",                default: ""
    t.string   "additional_info",        default: ""
    t.string   "locale",                 default: "fr"
    t.text     "settings",            default: "{}",  null: false
    t.text     "last_request",           default: "{}",  null: false
    t.integer  "current_topic_id"
    t.boolean  "admin",                  default: false, null: false
    t.string   "slug"
    t.datetime "deleted_at"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",        default: 0,     null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["pseudo"], name: "index_users_on_pseudo", where: "(deleted_at IS NULL)", using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["slug"], name: "index_users_on_slug", where: "(deleted_at IS NULL)", using: :btree
  add_index "users", ["unlock_token"], name: "index_users_on_unlock_token", unique: true, using: :btree

  create_table "versions", force: :cascade do |t|
    t.string   "item_type",      null: false
    t.integer  "item_id",        null: false
    t.string   "event",          null: false
    t.string   "whodunnit"
    t.string   "locale"
    t.text     "object"
    t.text     "object_changes"
    t.datetime "created_at"
  end

  add_index "versions", ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id", using: :btree

  create_table "votes", force: :cascade do |t|
    t.integer  "voteable_id",                   null: false
    t.string   "voteable_type",                 null: false
    t.integer  "voter_id"
    t.string   "voter_type"
    t.boolean  "vote",          default: false, null: false
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  add_index "votes", ["voteable_id", "voteable_type"], name: "index_votes_on_voteable_id_and_voteable_type", using: :btree
  add_index "votes", ["voter_id", "voter_type", "voteable_id", "voteable_type"], name: "fk_one_vote_per_user_per_entity", unique: true, using: :btree
  add_index "votes", ["voter_id", "voter_type"], name: "index_votes_on_voter_id_and_voter_type", using: :btree

end
