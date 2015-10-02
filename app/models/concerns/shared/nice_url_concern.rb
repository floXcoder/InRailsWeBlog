module Shared::NiceUrlConcern
  extend ActiveSupport::Concern

  included do
    include FriendlyId
    validates :slug,
              presence:   true,
              uniqueness: { case_sensitive: false }
  end
end
