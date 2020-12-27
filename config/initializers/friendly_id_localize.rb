module FriendlyId
  module LocalizedSlug
    # FriendlyId::Config.use will invoke this method when present, to allow
    # loading dependent modules prior to overriding them when necessary.
    def self.setup(model_class)
      model_class.friendly_id_config.use :slugged

      model_class.friendly_id_config.finder_methods = FriendlyId::LocalizedSlug::FinderMethods
      if model_class.friendly_id_config.uses? :finders
        relation.class.send(:include, model_class.friendly_id_config.finder_methods)
      end
    end

    def self.included(model_class)
      model_class.class_eval do
        friendly_id_config.class.send :include, Configuration
        include Model
      end
    end

    module Model
      def set_friendly_id
        self[friendly_id_config.slug_column] = nil
        default_text = slug_candidates
        I18n.available_locales.each do |l|
          I18n.with_locale(l) do
            set_slug(slug_candidates || default_text)
          end
        end
      end

      def slug
        current_slug = self[friendly_id_config.slug_column]
        if current_slug.present?
          if (locale_slug = current_slug[I18n.locale.to_s])
            return locale_slug
          elsif (default_locale_slug = current_slug[I18n.default_locale.to_s])
            return default_locale_slug
          else
            current_slug.values.first
          end
        else
          return nil
        end
      end

      def slug_translations
        self[friendly_id_config.slug_column]
      end

      def slug=(value)
        # super
        write_attribute friendly_id_config.slug_column, (self[friendly_id_config.slug_column] || {}).merge(I18n.locale.to_s => value)
      end
    end

    module Configuration
      def slug_column
        super
      end
    end

    module FinderMethods
      include ::FriendlyId::FinderMethods

      def exists_by_friendly_id?(id)
        where("#{friendly_id_config.slug_column}->>'#{I18n.locale}' = ?", id).exists?
      end

      private

      def first_by_friendly_id(id)
        where("#{friendly_id_config.slug_column}->>'#{I18n.locale}' = ?", id).first
      end
    end
  end
end
