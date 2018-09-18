# frozen_string_literal: true

RSpec::Matchers.define :acts_as_commentable do |model|
  match do |actual|
    expect(actual).to have_many(:comment_threads)

    expect(actual).to respond_to(:root_comments)
    expect(actual).to respond_to(:comments_ordered_by_submitted)
    expect(actual).to respond_to(:add_comment)
    expect(actual).to respond_to(:comments)
    expect(actual).to respond_to(:new_comment)
    expect(actual).to respond_to(:update_comment)
    expect(actual).to respond_to(:remove_comment)
    expect(actual).to respond_to(:comments_tree)
    expect(actual).to respond_to(:update_notation)

    expect(model).to respond_to(:find_comments_for)
    expect(model).to respond_to(:find_comments_by_user)
    expect(model).to respond_to(:most_rated)
    expect(model).to respond_to(:recently_rated)
  end

  description do
    'model acts as commentable'
  end

  failure_message do |model_name|
    "#{model_name} expected to have commentable methods"
  end

  failure_message_when_negated do |model_name|
    "#{model_name} expected not to have commentable methods"
  end
end
