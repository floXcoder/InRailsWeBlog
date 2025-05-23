# frozen_string_literal: true

module TranslationConcern
  extend ActiveSupport::Concern

  class TranslationError < StandardError
  end

  def translated?(field)
    self.translated_attribute_fields.include?(field.to_sym)
  end

  # All translated fields must be included in a select when used!
  def attributes
    super.merge(translated_fields)
  end

  def attribute_names
    translated_attribute_fields.map(&:to_s) + super
  end

  def write_attribute(name, value, *, &)
    return super unless translated?(name)

    current_locale    = I18n.locale.to_s

    value             = strip_translation(value) if self.auto_strip_translation_fields&.include?(name)

    self['languages'] = (self['languages'] || []).push(current_locale) if self['languages'].blank? || self['languages'].exclude?(current_locale)

    self["#{name}_translations"][current_locale] = value
  end

  def translated_fields
    translated_attribute_fields.inject({}) do |attributes, field|
      attributes.merge(field.to_s => send(field))
    end
  end

  def strip_translation(value)
    value = value.strip if value.respond_to?(:strip)
    value = nil if value.respond_to?(:blank?) && value.respond_to?(:empty?) && value.blank?

    return value
  end

  class_methods do
    # Base method to include in model:
    # translates :field_1, :field_2
    # options:
    # auto_strip_translation_fields
    # fallbacks_for_empty_translations (take first locale in languages column)
    def translates(*fields)
      options = fields.extract_options!
      apply_translations_options(options)

      check_columns!(fields)

      fields = fields.map(&:to_sym)

      fields.each do |field|
        # Create accessors for the attribute.
        define_translated_field_accessor(field)

        # Add attribute to the list.
        self.translated_attribute_fields << field
      end
    end

    # def translates?
    #   included_modules.include?(:apply_translations_options)
    # end

    def check_columns!(fields)
      untranslated_columns = fields.map { |field| "#{field}_translations" } - column_names

      raise TranslationError, 'missing languages columns' unless column_names.intersect?(['languages'])

      raise TranslationError, "following columns not translated: #{untranslated_columns.join(', ')}" unless untranslated_columns.empty?
    end

    def apply_translations_options(options)
      class_attribute :translated_attribute_fields, :translation_languages_field, :fallbacks_for_empty_translations, :auto_strip_translation_fields
      self.translated_attribute_fields      = []
      self.translation_languages_field      = :languages
      self.fallbacks_for_empty_translations = options[:fallbacks_for_empty_translations]
      self.auto_strip_translation_fields    = options[:auto_strip_translation_fields]
    end

    protected

    def define_translated_field_accessor(field)
      define_translated_field_reader(field)
      define_translated_field_record(field)
      define_translated_field_writer(field)
    end

    def define_translated_field_reader(field)
      define_method(field) do
        current_language = I18n.locale.to_s

        current_value = send(:"#{field}_translations")

        if current_value && self.fallbacks_for_empty_translations
          translation_keys    = send(:"#{field}_translations").keys
          available_languages = send(:languages)
          current_language    = available_languages.first if !available_languages&.empty? && translation_keys.exclude?(current_language)
        end

        current_value ? send(:"#{field}_translations").with_indifferent_access[current_language] : nil
      end
    end

    def define_translated_field_record(field)
      locale = I18n.locale.to_s

      define_method(:"#{field}_was") do
        send(:"#{field}_translations_was").with_indifferent_access[locale]
      end
    end

    def define_translated_field_writer(field)
      define_method(:"#{field}=") do |value|
        self[field] = value
      end
    end
  end

end
