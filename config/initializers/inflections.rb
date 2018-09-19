# frozen_string_literal: true

ActiveSupport::Inflector.inflections(:en) do |inflect|
  inflect.clear
  inflect.plural(/$/, 's')
  inflect.plural(/([sxz]|[cs]h)$/i, '\1es')
  inflect.plural(/([^aeiouy]o)$/i, '\1es')
  inflect.plural(/([^aeiouy])y$/i, '\1ies')
  inflect.singular(/s$/i, '')
  inflect.singular(/(ss)$/i, '\1')
  inflect.singular(/([sxz]|[cs]h)es$/, '\1')
  inflect.singular(/([^aeiouy]o)es$/, '\1')
  inflect.singular(/([^aeiouy])ies$/i, '\1y')
  inflect.irregular('child', 'children')
  inflect.irregular('person', 'people')
  inflect.irregular('self', 'selves')
  inflect.uncountable(%w(series))
end

ActiveSupport::Inflector.inflections(:fr) do |inflect|
  inflect.clear
  inflect.plural(/$/, 's')
  inflect.singular(/s$/, '')
  inflect.plural(/(bijou|caillou|chou|genou|hibou|joujou|pou|au|eu|eau)$/, '\1x')
  inflect.singular(/(bijou|caillou|chou|genou|hibou|joujou|pou|au|eu|eau)x$/, '\1')
  inflect.plural(/(bleu|émeu|landau|lieu|pneu|sarrau)$/, '\1s')
  inflect.plural(/al$/, 'aux')
  inflect.plural(/ail$/, 'ails')
  inflect.singular(/(journ|chev)aux$/, '\1al')
  inflect.singular(/ails$/, 'ail')
  inflect.plural(/(b|cor|ém|gemm|soupir|trav|vant|vitr)ail$/, '\1aux')
  inflect.singular(/(b|cor|ém|gemm|soupir|trav|vant|vitr)aux$/, '\1ail')
  inflect.plural(/(s|x|z)$/, '\1')
  inflect.irregular('monsieur', 'messieurs')
  inflect.irregular('madame', 'mesdames')
  inflect.irregular('mademoiselle', 'mesdemoiselles')
end
