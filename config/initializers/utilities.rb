# frozen_string_literal: true

###
# Add pluck_to_hash to ActiveRecord
###
module Utilities
  extend ActiveSupport::Concern

  module ClassMethods
    def pluck_to_hash(*keys)

      pluck(*keys).map do |row|
        row = [row] if keys.size == 1
        keys.zip(row).to_h
      end
    end

    alias pluck_h pluck_to_hash
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
      rel.total_pages = (count.to_f / per_page).ceil
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

      page_num         = num.nil? || num <= 0 ? 1 : num
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
# Add pagination to Array
###
class Array
  def paginate(options)
    options  = options.dup
    page_num = options.fetch(:page).to_i { raise ArgumentError, ':page parameter required' }
    options.delete(:page)
    per_page = options.delete(:per_page).to_i

    if options.any?
      raise ArgumentError, 'unsupported parameters: %p' % options.keys
    end

    page_num = page_num.nil? || page_num <= 0 ? 1 : page_num

    paginated    = self.slice((page_num - 1) * per_page, per_page)
    current_page = page_num
    total_pages  = (self.length.to_f / per_page).ceil
    total_count  = self.length

    return paginated, current_page, total_pages, total_count
  end
end

###
# Remove leading and trailing occurrences
###
class String
  def strip_this!(string)
    # Removes leading and trailing occurrences of the string
    # from the string, plus surrounding whitespace.
    if self.include?(string)
      string = Regexp.escape(string)
      sub!(/^(\s* #{string} \s*)+  /x, '')
      sub!(/ (\s* #{string} \s*)+ $/x, '')
    end

    return self
  end

  def title(options = {})
    options[:locale]     ||= :fr
    options[:stop_words] ||= []

    stop_words = {
      fr: %w[le la les l de des du d à au et avec un dans en pour ou où],
      en: %w[a an and the or for of nor]
    }
    stop_words = stop_words[options[:locale]] + options[:stop_words]

    self.split.each_with_index.map do |word, index|
      if word.include?("'")
        quoted_words = word.split("'")
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

  def strip_html(replace_with_line: false)
    content = if replace_with_line
                self.gsub(/<br *\/?>/im, "\n")
                    .gsub(/<p>/im, "\n")
                    .gsub(/<h1>/im, "\n")
                    .gsub(/<h2>/im, "\n")
                    .gsub(/<h3>/im, "\n")
                    .gsub(/<h4>/im, "\n")
                    .gsub(/<h5>/im, "\n")
                    .gsub(/<h6>/im, "\n")
                    .gsub(/<ol>/im, "\n")
                    .gsub(/<ul>/im, "\n")
                    .gsub(/<li>/im, "\n")
                    .gsub(/<blockquote>/im, "\n")
                    .gsub(/<pre>/im, "\n")
                    .gsub(/<table>/im, "\n")
              else
                self
              end

    content = content.gsub(/\n{3,}/, "\n\n")

    # ActionController::Base.helpers.strip_tags(content)
    return Sanitize.fragment(content)
  end

  def summary(length = 60, strip_html: false, replace_tags: false, remove_links: false, remove_code: false)
    string = self

    string = string.squish.gsub(/<pre(.*?)>(.*?)<\/pre>/i, '') if remove_code

    string = if replace_tags
               string.strip_html(replace_with_line: true)
             elsif strip_html
               string.strip_html(replace_with_line: false)
             else
               string.html_safe
             end

    string = string.gsub(/https?:\/\/(\S+.*?)/, '') if remove_links

    string = replace_tags ? string.strip : string.strip.squish

    if strip_html
      end_line = string.index(' ', length - 10)
      if end_line && string.length > length
        string = "#{string[0...end_line]}..."
      end
    else
      sanitized_string = Sanitize.fragment(self)
      last_space_index = sanitized_string.index(' ', length)
      last_word        = sanitized_string[0..last_space_index].split.last
      last_word_index  = last_word ? self.index(last_word, length) : nil
      string           = last_word_index && last_word_index + last_word.size < self.size ? self[0..(last_word_index + last_word.size)] : self
    end

    return string
  end
end

###
# Improve logging messages
###
module Kernel
  def w(*messages)
    return unless Rails.env.development? || Rails.env.test?

    if @view_renderer.present?
      p "*** #{Time.zone.now} ***"
      src = caller.first.gsub("#{Rails.root}/", '')
      p src
      messages.each do |message|
        if message.respond_to?(:to_unsafe_h)
          p message.to_unsafe_h
        elsif message.is_a? ActiveModel::Errors
          p message.errors
        else
          p message
        end
      end
      p '*** END ***'
    else
      ap "*** #{Time.zone.now} ***", color: { string: :green }
      # ap msg.class if msg.respond_to?(:class)
      src = caller.first.gsub("#{Rails.root}/", '')
      ap src, color: { string: :purpleish }
      messages.each do |message|
        if message.respond_to?(:to_unsafe_h)
          ap(message.to_unsafe_h)
        elsif message.is_a? ActiveModel::Errors
          ap message.errors
        else
          ap(message)
        end
      end
      ap '*** END ***', color: { string: :green }
    end
  end
end
