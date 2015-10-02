###
# Add pluck_to_hash to ActiveRecord
###
module Utilities
  extend ActiveSupport::Concern

  module ClassMethods
    def pluck_to_hash(*keys)

      pluck(*keys).map do |row|
        row = [row] if keys.size == 1
        Hash[keys.zip(row)]
      end
    end

    alias_method :pluck_h, :pluck_to_hash
  end
end

ActiveRecord::Base.send(:include, Utilities)

###
# Remove leading and trailing occurrences
###
class String
  def strip_this!(t)
    # Removes leading and trailing occurrences of t
    # from the string, plus surrounding whitespace.
    if self.include? t
      t = Regexp.escape(t)
      sub!(/^(\s* #{t} \s*)+  /x, '')
      sub!(/ (\s* #{t} \s*)+ $/x, '')
    end

    return self
  end
end
