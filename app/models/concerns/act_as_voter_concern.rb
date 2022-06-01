# frozen_string_literal: true

# ActAsVoterConcern

# Include this method in the model:
# acts_as_voteable
module ActAsVoterConcern
  extend ActiveSupport::Concern

  included do
    has_many :votes,
             as: :voter,
             dependent: :destroy,
             class_name: 'Vote'
  end

  # Usage user.vote_count(:up)  # All +1 votes
  #       user.vote_count(:down) # All -1 votes
  #       user.vote_count()      # All votes

  def vote_count(for_or_against = :all)
    v = Vote.where(:voter_id => id).where(:voter_type => self.class.base_class.name)
    v = case for_or_against
        when :all   then v
        when :up    then v.where(:vote => true)
        when :down  then v.where(:vote => false)
        end
    v.count
  end

  def voted_for?(voteable)
    voted_which_way?(voteable, :up)
  end

  def voted_against?(voteable)
    voted_which_way?(voteable, :down)
  end

  def voted_on?(voteable)
    0 < Vote.where(
      :voter_id => self.id,
      :voter_type => self.class.base_class.name,
      :voteable_id => voteable.id,
      :voteable_type => voteable.class.base_class.name
    ).count
  end

  def vote_for(voteable)
    self.vote(voteable, { :direction => :up, :exclusive => false })
  end

  def vote_against(voteable)
    self.vote(voteable, { :direction => :down, :exclusive => false })
  end

  def vote_exclusively_for(voteable)
    self.vote(voteable, { :direction => :up, :exclusive => true })
  end

  def vote_exclusively_against(voteable)
    self.vote(voteable, { :direction => :down, :exclusive => true })
  end

  def vote(voteable, options = {})
    raise ArgumentError, "you must specify :up or :down in order to vote" unless options[:direction] && [:up, :down].include?(options[:direction].to_sym)
    if options[:exclusive]
      self.unvote_for(voteable)
    end
    direction = (options[:direction].to_sym == :up)
    # create! does not return the created object
    v = Vote.new(:vote => direction, :voteable => voteable, :voter => self)
    v.save!
    v
  end

  def unvote_for(voteable)
    Vote.where(
      :voter_id => self.id,
      :voter_type => self.class.base_class.name,
      :voteable_id => voteable.id,
      :voteable_type => voteable.class.base_class.name
    ).map(&:destroy)
  end

  # class_methods do
  #   def acts_as_voter
  #   end
  # end
end
