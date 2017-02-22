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
      rel.total_pages = (count.to_f / per_page.to_f).ceil
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

      page_num         = (num.nil? || num <= 0) ? 1 : num
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

  def title(options = {})
    options[:locale] ||= :fr
    options[:stop_words] ||= []

    stop_words = {
      fr: %w{le la les l de des du d à au et avec un dans en pour ou où},
      en: %w{a an and the or for of nor}
    }
    stop_words = stop_words[options[:locale]] + options[:stop_words]

    self.split.each_with_index.map do |word, index|
      if word.include?("'")
        quoted_words = word.split(/'/)
        quoted_words.map do |quoted_word|
          (stop_words.include?(quoted_word.mb_chars.downcase.to_s) || quoted_word.count('0-9') > 0) && index > 0 ? quoted_word : quoted_word.mb_chars.capitalize.to_s
        end.join("'")
      else
        if (stop_words.include?(word.mb_chars.downcase.to_s) || word.count('0-9') > 0) && index > 0
          stop_words.include?(word.mb_chars.downcase.to_s) ? word.mb_chars.downcase.to_s : word
        else
          word.mb_chars.capitalize.to_s
        end
      end
    end.join(' ')
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

###
# Add round and floor methods
###
class Time
  def round_off(seconds = 60)
    Time.at((self.to_f / seconds).round * seconds).utc
  end

  def floor_off(seconds = 60)
    Time.at((self.to_f / seconds).floor * seconds).utc
  end
end

###
# Improve logging messages
###
module Kernel
  def w msg
    return unless Rails.env.development?

    ap "*** #{Time.zone.now} ***", color: { string: :green }
    ap msg.class if msg.respond_to?(:class)
    src = caller.first.gsub(Rails.root.to_s + '/', '')
    ap src, color: { string: :purpleish }
    ap msg
    ap '*** END ***', color: { string: :green }
  end
end
