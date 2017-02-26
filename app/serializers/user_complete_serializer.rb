# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string           default("")
#  last_name              :string           default("")
#  age                    :integer          default(0)
#  city                   :string           default("")
#  country                :string           default("")
#  additional_info        :string           default("")
#  locale                 :string           default("fr")
#  settings            :text             default({}), not null
#  admin                  :boolean          default(FALSE), not null
#  slug                   :string
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

class UserCompleteSerializer < ActiveModel::Serializer
  cache key: 'complete_user', expires_in: 12.hours

  attributes :id,
             :pseudo,
             :email,
             :first_name,
             :last_name,
             :age,
             :city,
             :country,
             :additional_info,
             :locale,
             :admin,
             :created_at,
             :avatar,
             :slug,
             :sign_in_count,
             :last_sign_in_at,
             :articles_count

  has_one :tracker
  # has_many :activities, serializer: PublicActivitiesSerializer
  # has_many :articles, serializer: ArticleSampleSerializer
  # has_many :comments, serializer: CommentSerializer

  def created_at
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  def avatar
    object.picture.image.url(:thumb) if object.picture
  end

  def last_sign_in_at
    I18n.l(object.last_sign_in_at, format: :custom).mb_chars.downcase.to_s if object.last_sign_in_at
  end

  def articles_count
    object.articles.count
  end
end
