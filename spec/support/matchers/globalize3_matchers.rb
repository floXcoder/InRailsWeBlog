RSpec::Matchers.define :transcribe do |field, locales|
  match do |model|
    @field = field
    @locales = locales
    @results = []
    @failures = []

    locales.each do |locale|
      expected_value = locale_value(locale)

      Globalize.with_locale locale do
        model.send :"#{field}=", expected_value

        returned_value = model.send(field)
        if returned_value.include?(expected_value)
          @results << [locale, expected_value]
        else
          @failures << [locale, expected_value, returned_value]
        end
      end
    end

    @failures.empty?
  end

  def locale_value(locale)
    locale.to_s
  end

  description do
    messages = @results.map{|lv| "#{lv[1]} for #{@field} with locale :#{lv[0]}"}

    "return #{messages.join(' and ')}"
  end

  failure_message do
    messages = @failures.map{|lv| "expected return #{lv[1]} but got #{lv[2]} for #{@field} with locale :#{lv[0]}"}

    messages.join("\n")
  end

  failure_message_when_negated do
    messages = @failures.map{|lv| "expected not to return #{lv[1]} for #{@field} with :#{lv[0]}"}

    messages.join("\n")
  end
end


RSpec::Matchers.define :fallback do |field, current_locale, fallback_locale|
  match do |model|
    @field = field
    @current = current_locale
    @current_value = locale_value(current_locale)
    @fallback = fallback_locale
    @fallback_value = locale_value(fallback_locale)
    @returned_value = nil

    Globalize.with_locale fallback_locale do
      model.send :"#{field}=", @fallback_value
    end

    Globalize.with_locale current_locale do
      model.send :"#{field}=", ''

      @returned_value = model.send(field)
      @returned_value.include?(@fallback_value)
    end
  end

  def locale_value(locale)
    locale.to_s
  end

  description do
    "fallback to #{@fallback_value} for #{@field} if it's blank with locale :#{@current}"
  end

  failure_message do
    "expected fallback to #{@fallback_value} but got #{@returned_value} for #{@field} if it's blank with locale :#{@current}"
  end

  failure_message_when_negated do
    "expected not fallback to #{@fallback_value} but got #{@returned_value} for #{@field} if it's blank with locale :#{@current}"
  end
end
