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

module Pagination
  extend ActiveSupport::Concern

  module ClassMethods
    attr_accessor :current_page, :total_pages, :total_count

    def paginate(options)
      options  = options.dup
      page_num = options.fetch(:page) { raise ArgumentError, ':page parameter required' }
      options.delete(:page)
      per_page = options.delete(:per_page) || self.per_page

      if options.any?
        raise ArgumentError, 'unsupported parameters: %p' % options.keys
      end

      rel             = limit(per_page.to_i).page(page_num.to_i, per_page.to_i)
      rel.total_count = count
      rel.total_pages = (count / per_page.to_i).round
      rel
    end

    def page(num, per_page)
      rel = if ::ActiveRecord::Relation === self
              self
            elsif !defined?(::ActiveRecord::Scoping) or ::ActiveRecord::Scoping::ClassMethods.method_defined? :with_scope
              # Active Record 3
              scoped
            else
              # Active Record 4
              all
            end

      page_num         = num.nil? ? 1 : num
      rel              = rel.offset((page_num - 1) * per_page.to_i)
      rel              = rel.limit(per_page)
      rel.current_page = page_num
      rel
    end
  end
end

ActiveRecord::Base.send(:include, Utilities)
ActiveRecord::Base.send(:include, Pagination)

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

  def summary(length = 60)
    end_line = self.html_safe.index(' ', length - 10)
    if end_line && self.html_safe.length > length
      desc = self[0...end_line] + '...'
      desc.html_safe
    else
      self.html_safe
    end
  end
end
