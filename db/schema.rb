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

ActiveRecord::Schema.define(version: 20151017185225) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "article_translations", force: :cascade do |t|
    t.integer  "article_id",              null: false
    t.string   "locale",                  null: false
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.string   "title",      default: ""
    t.text     "summary",    default: ""
    t.text     "content",    default: "", null: false
  end

  add_index "article_translations", ["article_id"], name: "index_article_translations_on_article_id", using: :btree
  add_index "article_translations", ["locale"], name: "index_article_translations_on_locale", using: :btree

  create_table "articles", force: :cascade do |t|
    t.integer  "author_id",                       null: false
    t.integer  "visibility",      default: 0,     null: false
    t.integer  "notation",        default: 0
    t.integer  "priority",        default: 0
    t.boolean  "allow_comment",   default: false, null: false
    t.boolean  "private_content", default: false, null: false
    t.boolean  "is_link",         default: false, null: false
    t.string   "slug"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  add_index "articles", ["author_id"], name: "index_articles_on_author_id", using: :btree
  add_index "articles", ["slug"], name: "index_articles_on_slug", unique: true, using: :btree

  create_table "pictures", force: :cascade do |t|
    t.integer  "imageable_id",   null: false
    t.string   "imageable_type", null: false
    t.string   "image"
    t.string   "image_tmp"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  add_index "pictures", ["imageable_type", "imageable_id"], name: "index_pictures_on_imageable_type_and_imageable_id", using: :btree

  create_table "preferences", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name",       null: false
    t.string   "value",      null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tag_relationships", force: :cascade do |t|
    t.integer  "parent_id"
    t.integer  "child_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "tag_relationships", ["child_id"], name: "index_tag_relationships_on_child_id", using: :btree
  add_index "tag_relationships", ["parent_id", "child_id"], name: "index_tag_relationships_on_parent_id_and_child_id", unique: true, using: :btree
  add_index "tag_relationships", ["parent_id"], name: "index_tag_relationships_on_parent_id", using: :btree

  create_table "tagged_articles", force: :cascade do |t|
    t.integer  "article_id"
    t.integer  "tag_id"
    t.boolean  "parent",     default: false, null: false
    t.boolean  "child",      default: false, null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "tagged_articles", ["article_id", "tag_id"], name: "index_tagged_articles_on_article_id_and_tag_id", unique: true, using: :btree
  add_index "tagged_articles", ["article_id"], name: "index_tagged_articles_on_article_id", using: :btree
  add_index "tagged_articles", ["tag_id"], name: "index_tagged_articles_on_tag_id", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string   "name",       null: false
    t.string   "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "tags", ["name"], name: "index_tags_on_name", using: :btree
  add_index "tags", ["slug"], name: "index_tags_on_slug", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "pseudo",                 default: "",   null: false
    t.string   "first_name",             default: ""
    t.string   "last_name",              default: ""
    t.integer  "age",                    default: 0
    t.string   "city",                   default: ""
    t.string   "country",                default: ""
    t.string   "additional_info",        default: ""
    t.string   "locale",                 default: "fr"
    t.string   "slug"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.string   "email",                  default: "",   null: false
    t.string   "encrypted_password",     default: "",   null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,    null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",        default: 0,    null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["slug"], name: "index_users_on_slug", unique: true, using: :btree
  add_index "users", ["unlock_token"], name: "index_users_on_unlock_token", unique: true, using: :btree

end
