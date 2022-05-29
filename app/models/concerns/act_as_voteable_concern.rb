# frozen_string_literal: true

# ActAsVoteableConcern

# Include this method in the model:
# acts_as_voteable
module ActAsVoteableConcern
  extend ActiveSupport::Concern

  included do
    has_many :votes,
             as: :voteable,
             dependent: :destroy,
             class_name: 'Vote'
  end

  def votes_for
    self.votes.where(:vote => true).count
  end

  def votes_against
    self.votes.where(:vote => false).count
  end

  def percent_for
    (votes_for.to_f * 100 / (self._votes_on.size + 0.0001)).round
  end

  def percent_against
    (votes_against.to_f * 100 / (self._votes_on.size + 0.0001)).round
  end

  def voted_by?(voter)
    0 < Vote.where(
      :voteable_id => self.id,
      :voteable_type => self.class.base_class.name,
      :voter_id => voter.id
    ).count
  end

  # class_methods do
  #   def acts_as_voteable
  #   end
  # end
end
