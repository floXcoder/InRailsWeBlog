# frozen_string_literal: true

require 'open3'

class Logger < ::Logger
  def self.file_name
    file_name_noext + '.log'
  end

  def self.error(message)
    build.error(message)
  end

  def self.info(message)
    build.info(message)
  end

  def self.read_latest(size = 4_000)
    path = Rails.root.join('log', file_name)
    self.build unless File.exist?(path)
    tail_output, _ = Popen.popen(%W[tail -n #{size} #{path}])
    tail_output.split("\n")
  end

  def self.read_latest_for(filename, size = 4_000)
    path         = Rails.root.join('log', filename)
    tail_output, = Popen.popen(%W[tail -n #{size} #{path}])
    tail_output.split("\n")
  end

  def self.build
    new(Rails.root.join('log', file_name))
  end
end

module Popen
  def self.popen(cmd, path = nil)
    unless cmd.is_a?(Array)
      raise 'System commands must be given as an array of strings'
    end

    path    ||= Dir.pwd
    vars    = { 'PWD' => path }
    options = { chdir: path }

    unless File.directory?(path)
      FileUtils.mkdir_p(path)
    end

    @cmd_output = ''
    @cmd_status = 0
    Open3.popen3(vars, *cmd, options) do |stdin, stdout, stderr, wait_thr|
      # We are not using stdin so we should close it, in case the command we
      # are running waits for input.
      stdin.close
      @cmd_output += stdout.read
      @cmd_output += stderr.read
      @cmd_status = wait_thr.value.exitstatus
    end

    [@cmd_output, @cmd_status]
  end
end
