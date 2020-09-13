# frozen_string_literal: true

module TranslationConcern
  extend ActiveSupport::Concern

  class TranslationError < StandardError
  end

  def translated?(field)
    self.translated_attribute_fields.include?(field.to_sym)
  end

  def attributes
    super.merge(translated_fields)
  end

  def attribute_names
    translated_attribute_fields.map(&:to_s) + super
  end

  def write_attribute(name, value, *args, &block)
    return super(name, value, *args, &block) unless translated?(name)

    value = self.auto_strip_translation_fields&.include?(name) ? strip_translation(value) : value

    self["#{name}_translations"][I18n.locale.to_s] = value
  end

  def translated_fields
    translated_attribute_fields.inject({}) do |attributes, field|
      attributes.merge(field.to_s => send(field))
    end
  end

  def strip_translation(value)
    value = value.respond_to?(:strip) ? value.strip : value
    value = value.respond_to?(:'blank?') && value.respond_to?(:'empty?') && value.blank? ? nil : value

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

      raise TranslationError, 'missing languages columns' if (column_names & ['languages']).empty?

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

        if self.fallbacks_for_empty_translations
          translation_keys = send("#{field}_translations").keys
          available_languages = send(:languages)
          current_language = available_languages.first if !available_languages&.empty? && !translation_keys.include?(current_language)
        end

        send("#{field}_translations")[current_language]
      end
    end

    def define_translated_field_record(field)
      locale = I18n.locale.to_s

      define_method("#{field}_was") do
        send("#{field}_translations_was")[locale]
      end
    end

    def define_translated_field_writer(field)
      define_method(:"#{field}=") do |value|
        self[field] = value
      end
    end
  end

end
