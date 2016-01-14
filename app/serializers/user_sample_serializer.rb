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
#  preferences            :text             default({}), not null
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

class UserSampleSerializer < ActiveModel::Serializer
  cache key: 'user_sample', expires_in: 12.hours

  attributes :id,
             :pseudo,
             :slug,
             :avatar

  def avatar
    object.picture.image.url(:thumb) if object.picture
  end
end
