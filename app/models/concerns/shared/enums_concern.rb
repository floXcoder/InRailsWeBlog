module Shared::EnumsConcern
  extend ActiveSupport::Concern

  VISIBILITY = [:everyone, :only_me]
  # VISIBILITY            = [ :everyone, :only_me, :selected_group ]

  included do
    def self.enums_to_tr(klass, enums)
      enums.each do |enum|
        method_name = (enum.to_s + '_to_tr').to_sym
        send :define_method, method_name do
          I18n.t(klass + '.enums.' + enum.to_s + '.' + self.send(enum))
        end
      end
    end
  end

end
