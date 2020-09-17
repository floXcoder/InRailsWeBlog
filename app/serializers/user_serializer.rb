# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string
#  last_name              :string
#  street                 :string
#  city                   :string
#  postcode               :string
#  state                  :string
#  country                :string
#  mobile_number          :string
#  phone_number           :string
#  additional_info        :string
#  birth_date             :date
#  locale                 :string           default("fr")
#  settings               :jsonb            not null
#  allow_comment          :boolean          default(TRUE), not null
#  visibility             :integer          default("everyone"), not null
#  current_topic_id       :integer
#  pictures_count         :integer          default(0)
#  topics_count           :integer          default(0)
#  articles_count         :integer          default(0)
#  tags_count             :integer          default(0)
#  bookmarks_count        :integer          default(0)
#  comments_count         :integer          default(0)
#  slug                   :string
#  deleted_at             :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#

class UserSerializer
  include FastJsonapi::ObjectSerializer
  include NullAttributesRemover

  cache_options store: Rails.cache, namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer", expires_in: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :pseudo,
             :email,
             :first_name,
             :last_name,
             :city,
             :country,
             :additional_info,
             :locale,
             :slug,
             :avatar_url,
             :sign_in_count

  has_one :current_topic, record_type: :topic, serializer: TopicSerializer

  has_one :tracker, serializer: TrackerSerializer

  has_many :topics, serializer: TopicSerializer do |object|
    object.topics.includes(:tagged_articles).order('created_at asc')
  end

  has_many :contributed_topics, serializer: TopicSerializer do |object|
    object.contributed_topics.includes(:tagged_articles).order('created_at asc')
  end

  attribute :date do |object|
    object.created_at.to_i
  end

  attribute :created_at do |object|
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  attribute :last_sign_in_at do |object|
    I18n.l(object.last_sign_in_at, format: :custom).mb_chars.downcase.to_s if object.last_sign_in_at
  end

  attribute :articles_count do |object|
    object.article_ids.size
  end

  attribute :link do |object|
    Rails.application.routes.url_helpers.show_user_path(user_slug: object.slug)
  end

  attribute :settings do |object|
    UserSettingSerializer.new(object).serializable_hash[:data][:attributes]
  end
end
