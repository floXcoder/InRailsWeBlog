# frozen_string_literal: true

module EnumsConcern
  extend ActiveSupport::Concern

  VISIBILITY = [:everyone, :only_me].freeze

  TOPIC_MODE = [:default, :stories].freeze

  ARTICLE_MODE = [:note, :story, :link].freeze

  SHARE_MODE = [:link, :with_user, :with_group].freeze

  SETTING_VALUE_TYPE = [:string_type, :integer_type, :boolean_type, :array_type, :hash_type].freeze

  ERROR_ORIGIN = [:server, :client, :communication].freeze

  included do
    def self.enums_to_tr(klass, enums)
      enums.each do |enum|
        method_name = (enum.to_s + '_to_tr').to_sym
        send(:define_method, method_name) do
          self.send(enum) && I18n.t(klass + '.enums.' + enum.to_s + '.' + self.send(enum))
        end
      end
    end
  end

end
