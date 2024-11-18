# frozen_string_literal: true

if Rails.env.development?
  Rails.application.console do
    $stdout.clear_screen

    class User
      class << self
        alias [] find
      end
    end

    class Article
      class << self
        alias [] find
      end
    end

    class Topic
      class << self
        alias [] find
      end
    end

    class Tag
      class << self
        alias [] find
      end
    end
  end
end
