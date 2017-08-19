require 'benchmark'

RSpec::Matchers.define :take_less_than do |duration|
  chain :seconds do; end

  match do |block|
    @time_elapsed = Benchmark.realtime do
      block.call
    end.round(3)

    @time_elapsed <= duration
  end

  def supports_block_expectations?
    true
  end

  description do
    "perform under #{duration}"
  end

  failure_message do |_block|
    "expected block to #{description}, but performed at #{@time_elapsed}"
  end

  failure_message_when_negated do |_block|
    "expected block to not #{description}, but performed at #{@time_elapsed}"
  end
end
