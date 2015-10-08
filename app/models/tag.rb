# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Tag < ActiveRecord::Base
  # Associations
  has_and_belongs_to_many :articles

  # Validations
  validates :name,
            presence: true,
            uniqueness: { case_sensitive: false },
            length:   { minimum: 1, maximum: 128 }

end
