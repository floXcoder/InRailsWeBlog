module Shared::PreferencesConcern
  extend ActiveSupport::Concern

  included do
    has_many :preferences do
      def find_or_create_by_name(name, value)
        find_or_create_by(name: name, value: value)
      end
    end
    @@preferences = {}
  end

  module ClassMethods
    def preference(name, default)
      preferences = self.class_variable_get(:'@@preferences')
      preferences[name] = default
      self.class_variable_set(:'@@preferences', preferences)
    end
  end

  def read_preference(name)
    if (p = self.preferences.where(name: name).first)
      p.value
    else
      self.preferences.find_or_create_by(name: name, value: @@preferences[name]) if @@preferences.has_key?(name)
    end
    # return self.preferences.new(name: name, value: @@preferences[name]).value if @@preferences.has_key?(name)
    # nil
  end

  def write_preference(name, value)
    if (p = self.preferences.where(name: name).first)
      p.update_attribute(:value, value)
    else
      nil
    end
    # p = self.preferences.find_or_create_by_name(name)
  end

  # def method_missing(method, *args)
  #   if @@preferences.keys.any?{|k| method =~ /#{k}/}
  #     if method =~ /=/
  #       self.write_preference(method.gsub('=', ''), *args)
  #     else
  #       self.read_preference(method)
  #     end
  #   else
  #     super
  #   end
  # end
end
