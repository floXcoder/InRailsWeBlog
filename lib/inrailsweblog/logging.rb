# frozen_string_literal: true

require 'open3'
require 'shellwords'

module Popen
  Result = Struct.new(:cmd, :stdout, :stderr, :status, :duration)

  # Returns [stdout + stderr, status]
  def self.popen(cmd, path = nil, vars = {}, &block)
    result = popen_with_detail(cmd, path, vars, &block)

    ["#{result.stdout}#{result.stderr}", result.status&.exitstatus]
  end

  # Returns [stdout, status]
  def self.pipeline(cmd, path = nil, vars = {}, &block)
    result = pipe_with_detail(cmd, path, vars, &block)

    ["#{result.stdout}#{result.stderr}", result.status&.exitstatus]
  end

  # Returns Result
  def self.popen_with_detail(cmd, path = nil, vars = {})
    raise 'System commands must be given as an array of strings' unless cmd.is_a?(Array)

    path        ||= Dir.pwd
    vars['PWD'] = path
    options     = { chdir: path }

    FileUtils.mkdir_p(path) unless File.directory?(path)

    cmd_stdout = ''
    cmd_stderr = ''
    cmd_status = nil
    start      = Time.zone.now

    Open3.popen3(vars, *cmd, options) do |stdin, stdout, stderr, wait_thr|
      # stderr and stdout pipes can block if stderr/stdout aren't drained: https://bugs.ruby-lang.org/issues/9082
      # Mimic what Ruby does with capture3: https://github.com/ruby/ruby/blob/1ec544695fa02d714180ef9c34e755027b6a2103/lib/open3.rb#L257-L273
      out_reader = Thread.new { stdout.read }
      err_reader = Thread.new { stderr.read }

      yield(stdin) if block_given?
      stdin.close

      cmd_stdout = out_reader.value
      cmd_stderr = err_reader.value
      cmd_status = wait_thr.value
    end

    Result.new(cmd, cmd_stdout, cmd_stderr, cmd_status, Time.zone.now - start)
  end

  # Returns Result
  def self.pipe_with_detail(cmds, path = nil, vars = {})
    raise 'System commands must be given as an array of strings' unless cmds.is_a?(Array)

    path        ||= Dir.pwd
    vars['PWD'] = path
    options     = { chdir: path }

    FileUtils.mkdir_p(path) unless File.directory?(path)

    cmd_stdout = ''
    cmd_status = nil
    start      = Time.zone.now

    Open3.pipeline_rw(*cmds, options) do |first_stdin, last_stdout, wait_threads|
      # stderr and stdout pipes can block if stderr/stdout aren't drained: https://bugs.ruby-lang.org/issues/9082
      # Mimic what Ruby does with capture3: https://github.com/ruby/ruby/blob/1ec544695fa02d714180ef9c34e755027b6a2103/lib/open3.rb#L257-L273
      out_reader = Thread.new { last_stdout.read }

      yield(first_stdin) if block_given?
      first_stdin.close

      cmd_stdout = out_reader.value
      cmd_status = wait_threads.last.value
    end

    Result.new(cmds, cmd_stdout, nil, cmd_status, Time.zone.now - start)
  end
end

class Logging
  def self.grep_for(filename, search, max_size: 2_000)
    path = Rails.root.join('log', filename)
    return [] unless File.exist?(path)

    tail_output, = Popen.pipeline([%W[tail -n #{max_size} #{path}], %W[fgrep #{search}]])
    tail_output.split("\n")
  end

  def self.grep_date_for(filename, date, max_size: 2_000)
    path = Rails.root.join('log', filename)
    return [] unless File.exist?(path)

    tail_output, = Popen.popen(%W[grep -A #{max_size} #{date} #{path}])
    tail_output.split("\n")
  end

  def self.multi_grep_for(filename, searches, max_size: 2_000, regex: false)
    path = Rails.root.join('log', filename)
    return [] unless File.exist?(path)

    search_operator = regex ? 'grep' : 'fgrep'

    tail_output, = Popen.pipeline([%W[tail -n #{max_size} #{path}], *searches.map { |s| %W[#{search_operator} #{regex ? '-P' : ''} -e #{s}] }])
    tail_output.split("\n")
  end

  def self.grep_and_sort_for(filename, search, max_size: 2_000)
    path = Rails.root.join('log', filename)
    return [] unless File.exist?(path)

    tail_output, = Popen.pipeline([%W[tail -n #{max_size} #{path}], %W[fgrep #{search}], ['grep', '-oP', 'path=\K.*? '], %w[sort], %w[uniq -c], %w[sort -nr]])
    tail_output.split("\n")
  end

  def self.read_latest_for(filename, size: 4_000)
    path = Rails.root.join('log', filename)
    return [] unless File.exist?(path)

    tail_output, = Popen.popen(%W[tail -n #{size} #{path}])
    tail_output.split("\n")
  end
end
