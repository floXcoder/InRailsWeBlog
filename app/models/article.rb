# == Schema Information
#
# Table name: articles
#
#  id                        :integer          not null, primary key
#  author_id                 :integer          not null
#  topic_id                  :integer          not null
#  title                     :string           default("")
#  summary                   :text             default("")
#  content                   :text             default(""), not null
#  private_content           :boolean          default(FALSE), not null
#  is_link                   :boolean          default(FALSE), not null
#  reference                 :text
#  temporary                 :boolean          default(FALSE), not null
#  language                  :string
#  allow_comment             :boolean          default(TRUE), not null
#  notation                  :integer          default(0)
#  priority                  :integer          default(0)
#  visibility                :integer          default(0), not null
#  archived                  :boolean          default(FALSE), not null
#  accepted                  :boolean          default(TRUE), not null
#  bookmarked_articles_count :integer          default(0)
#  outdated_articles_count   :integer          default(0)
#  slug                      :string
#  deleted_at                :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#

class Article < ActiveRecord::Base

  # == Attributes ===========================================================
  include EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('article', [:visibility])

  # Strip whitespaces
  auto_strip_attributes :title, :summary

  # == Extensions ===========================================================
  # Voteable model
  acts_as_voteable

  # Versioning
  has_paper_trail on: [:update], only: [:title, :summary, :content, :topic, :language]

  # Marked as deleted
  acts_as_paranoid

  # Comments
  include CommentableConcern

  # Track activities
  include ActAsTrackedConcern
  acts_as_tracked :queries, :searches, :comments, :bookmarks, :clicks, :views

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :author

  # Nice url format
  include NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Elastic Search
  searchkick searchable:  [:title, :tags],
             word_middle: [:title, :tags],
             suggest:     [:title, :tags],
             highlight:   [:content, :public_content],
             include:     [:author, :tags, :parent_tags, :child_tags],
             language:    (I18n.locale == :fr) ? 'French' : 'English'

  def search_data
    {
      author_id:      author_id,
      topic_id:       topic_id,
      title:          title,
      summary:        summary,
      public_content: public_content,
      content:        strip_content,
      is_link:        is_link,
      notation:       notation,
      priority:       priority,
      temporary:      temporary,
      language:       language,
      visibility:     visibility,
      archived:       archived,
      accepted:       accepted,
      tags:           tags.pluck(:name)
    }
  end

  # == Relationships ========================================================
  belongs_to :author, class_name: 'User'
  belongs_to :topic

  has_many :tagged_articles
  has_many :tags,
           through:   :tagged_articles,
           autosave: true
  has_many :parent_tags,
           -> { where(tagged_articles: { parent: true }) },
           through:  :tagged_articles,
           source:   :tag
  has_many :child_tags,
           -> { where(tagged_articles: { child: true }) },
           through:  :tagged_articles,
           source:   :tag
  # accepts_nested_attributes_for :tags,
  #                               reject_if:     :all_blank,
  #                               update_only:   true,
  #                               allow_destroy: false

  has_many :bookmarked_articles
  has_many :user_bookmarks,
           through: :bookmarked_articles,
           source:  :user

  has_many :outdated_articles
  has_many :marked_as_outdated,
           through: :outdated_articles,
           source:  :user

  has_many :activities, as: :trackable, class_name: 'PublicActivity::Activity'

  # == Validations ==========================================================
  validates :author,
            presence: true
  validates :topic,
            presence: true

  validates :title,
            length: { minimum: CONFIG.article_title_min_length, maximum: CONFIG.article_title_max_length },
            if:     'title.present?'
  validates :summary,
            length: { minimum: CONFIG.article_summary_min_length, maximum: CONFIG.article_summary_max_length },
            if:     'summary.present?'
  validates :content,
            presence: true,
            length:   { minimum: CONFIG.article_content_min_length, maximum: CONFIG.article_content_max_length }
  validates :notation, inclusion: CONFIG.notation_min..CONFIG.notation_max

  # == Scopes ===============================================================
  scope :user_related, -> (user_id = nil) {
    where('articles.visibility = 0 OR (articles.visibility = 1 AND articles.author_id = :author_id)',
          author_id: user_id)
  }
  scope :published, -> { where(temporary: false) }

  # Helpers
  scope :with_tags, -> (tags) { joins(:tags).where(tags: { name: tags }) }
  scope :with_parent_tags, -> (parent_tags) { joins(:tags).where(tagged_articles: { parent: true }, tags: { name: parent_tags }) }
  scope :with_child_tags, -> (child_tags) { joins(:tags).where(tagged_articles: { child: true }, tags: { name: child_tags }) }

  # == Callbacks ============================================================
  # Sanitize and detect programming language if any before save
  before_save :sanitize_html

  # == Class Methods ========================================================
  # Article Search
  # +query+ parameter: string to query
  # +options+ parameter:
  #  current_user_id (current user id)
  #  page (page number for pagination)
  #  per_page (number of articles per page for pagination)
  #  exact (exact search or include misspellings, default: 2)
  #  tags (array of tags associated with articles)
  #  operator (array of tags associated with articles, default: AND)
  #  highlight (highlight content, default: true)
  #  exact (do not misspelling, default: false, 1 character)
  def self.search_for(query, options = {})
    # If query not defined or blank, search for everything
    query_string          = !query || query.blank? ? '*' : query

    # Fields with boost
    fields                = if I18n.locale == :fr
                              %w(title^10 content^5 public_content)
                            else
                              %w(title^10 content^5 public_content)
                            end

    # Misspelling, specify number of characters
    misspellings_distance = options[:exact] ? 0 : 1

    # Operator type: 'and' or 'or'
    operator              = options[:operator] ? options[:operator] : 'and'

    # Highlight results and select a fragment
    # highlight = options[:highlight] ? {fields: {content: {fragment_size: 200}}, tag: '<span class="blog-highlight">'} : false
    highlight             = { tag: '<span class="blog-highlight">' }

    # Include tag in search, all tags: options[:tags] ; at least one tag: {all: options[:tags]}
    where_options         = options[:where].compact.reject { |_k, v| v.empty? }.map do |key, value|
      if key == :notation
        [
          key,
          value.to_i
        ]
      else
        [key, value]
      end
    end.to_h
    where_options[:tags]  = { all: options[:tags] } if options[:tags]

    # Boost user articles first
    boost_where           = options[:current_user_id] ? { author_id: options[:current_user_id] } : nil

    # Page parameters
    page                  = options[:page] ? options[:page] : 1
    per_page              = options[:per_page] ? options[:per_page] : CONFIG.per_page

    # Perform search
    results               = Article.search(query_string,
                                           fields:       fields,
                                           boost_where:  boost_where,
                                           highlight:    highlight,
                                           match:        :word_middle,
                                           misspellings: { edit_distance: misspellings_distance },
                                           suggest:      true,
                                           page:         page,
                                           per_page:     per_page,
                                           operator:     operator,
                                           where:        where_options)

    words_search = Article.searchkick_index.tokens(query_string, analyzer: 'searchkick_search2') & query_string.squish.split(' ')

    return Article.none unless results.any?

    # Track search results
    Article.track_searches(results.records.ids)

    {
      shops:       results.records,
      highlight:   Hash[results.with_details.map { |article, details| [article.id, details[:highlight]] }],
      suggestions: results.suggestions,
      total_count: results.total_count,
      total_pages: results.total_pages,
      words:       words_search.uniq
    }
  end

  def self.autocomplete_for(query, options = {})
    return Article.none if Article.count.zero?

    # If query not defined or blank, search for everything
    query_string  = !query || query.blank? ? '*' : query

    # Where options only for ElasticSearch
    where_options = options[:where].compact.map do |key, value|
      [key, value]
    end.to_h

    # Set result limit
    limit         = options[:limit] ? options[:limit] : 10

    # Perform search
    results       = Article.search(query_string,
                                   fields:       %w(name^3 summary),
                                   match:        :word_middle,
                                   misspellings: { below: 5 },
                                   load:         false,
                                   where:        where_options,
                                   limit:        limit)

    return Article.none unless results.any?

    return results.records
  end

  # == Instance Methods =====================================================
  def author?(user)
    user.id == self.author_id if user
  end

  def format_attributes(attributes = {}, current_user = nil)
    # Clean attributes
    attributes    = attributes.reject { |_, v| v.blank? }

    # Topic: Add current topic to article
    self.topic_id = current_user.current_topic_id if current_user

    # Sanitization
    if attributes[:title].present?
      sanitized_title = Sanitize.fragment(attributes.delete(:title))
      self.slug       = nil if sanitized_title != self.title
      self.title      = sanitized_title
    end
    if attributes[:summary].present?
      self.summary = Sanitize.fragment(attributes.delete(:summary))
    end

    # Tags
    # self.tags        = article_tags = []
    self.parent_tags = parent_tags = []
    self.child_tags  = child_tags = []
    if attributes[:parent_tags].present?
      parent_tags = Tag.parse_tags(attributes.delete(:parent_tags), current_user&.id)
    end
    if attributes[:child_tags].present?
      child_tags = Tag.parse_tags(attributes.delete(:child_tags), current_user&.id)
    end
    self.parent_tags = parent_tags
    self.child_tags  = child_tags
    # self.tags        = (parent_tags + child_tags).uniq

    self.assign_attributes(attributes)
  end

  def create_tag_relationships
    self.parent_tags.each do |parent|
      self.child_tags.each do |child|
        if parent.children.exists?(child.id)
          tag_relationship     = parent.parent_relationship.find_by(child_id: child.id)
          previous_article_ids = tag_relationship.article_ids
          tag_relationship.update_attribute(:article_ids, previous_article_ids + [self.id])
        else
          parent.parent_relationship.create!(child_id: child.id, article_ids: [self.id])
        end
      end
    end unless self.child_tags.empty?
  end

  def update_tag_relationships(previous_parent_tags, previous_child_tags)
    previous_parent_tags.each do |previous_parent|
      previous_child_tags.each do |previous_child|
        if self.parent_tags.exists?(previous_parent.id)
          unless self.child_tags.exists?(previous_child.id)
            tag_relationship = previous_parent.parent_relationship.find_by(child_id: previous_child.id)
            new_article_ids  = tag_relationship.article_ids - [self.id]
            if new_article_ids.empty?
              tag_relationship.destroy
            else
              tag_relationship.update_attribute(:article_ids, new_article_ids)
            end
          end
        else
          tag_relationship = previous_child.child_relationship.find_by(parent_id: previous_parent.id)
          new_article_ids  = tag_relationship.article_ids - [self.id]
          if new_article_ids.empty?
            tag_relationship.destroy
          else
            tag_relationship.update_attribute(:article_ids, new_article_ids)
          end
        end
      end
    end unless previous_child_tags.empty?
  end

  def delete_tag_relationships(previous_parent_tags, previous_child_tags)
    previous_parent_tags.each do |previous_parent|
      previous_child_tags.each do |previous_child|
        tag_relationship = previous_parent.parent_relationship.find_by(child_id: previous_child.id)
        new_article_ids  = tag_relationship.article_ids - [self.id]
        if new_article_ids.empty?
          tag_relationship.destroy
        else
          tag_relationship.update_attribute(:article_ids, new_article_ids)
        end
      end
    end unless previous_child_tags.empty?
  end

  def tags_to_topic(current_user, params = {})
    if params[:new_tags] && !params[:new_tags].empty?
      params[:new_tags].map do |tag|
        tag.tagged_topics.build(topic_id: current_user.current_topic_id,
                                user_id:  current_user.id)
      end
    elsif params[:old_tags] && !params[:old_tags].empty?
      params[:old_tags].map do |tag|
        tag.tagged_topics.where(topic_id: current_user.current_topic_id,
                                user_id:  current_user.id).first&.destroy
      end
    end
  end

  def add_bookmark(user)
    if self.user_bookmarks.exists?(user.id)
      errors.add(:bookmark, I18n.t('activerecord.errors.models.bookmark.already_bookmarked'))
      return false
    else
      return self.user_bookmarks.push(user)
    end
  end

  def remove_bookmark(user)
    if !self.user_bookmarks.exists?(user.id)
      errors.add(:bookmark, I18n.t('activerecord.errors.models.bookmark.not_bookmarked'))
    else
      return self.user_bookmarks.delete(user)
    end
  end

  def mark_as_outdated(user)
    if self.marked_as_outdated.exists?(user.id)
      errors.add(:outdated, I18n.t('activerecord.errors.models.outdated.already_outdated'))
      return false
    else
      return self.marked_as_outdated.push(user)
    end
  end

  def remove_outdated(user)
    if !self.marked_as_outdated.exists?(user.id)
      errors.add(:outdated, I18n.t('activerecord.errors.models.outdated.not_outdated'))
    else
      return self.marked_as_outdated.delete(user)
    end
  end

  def slug_candidates
    "#{title}_at_#{author.pseudo}"
  end

  def normalize_friendly_id(_string)
    super.tr('-', '_').tr('_at_', '@')
  end

  def strip_content
    sanitize(self.content.gsub(/(<\/\w+>)/i, '\1 '), tags: [], attributes: []).squish
  end

  def public_content
    self.content.gsub(/<(\w+) class="secret">(.*?)<\/\1>/im, '')
  end

  def has_private_content?
    self.content =~ /<(\w+) class="secret">.*?<\/\1>/im
  end

  def adapted_content(current_user_id)
    if self.private_content && self.author.id != current_user_id
      self.public_content
    else
      self.content
    end
  end

  def summary_content(current_user_id = nil)
    adapted_content(current_user_id).summary
  end

  # Sanitize content
  include ActionView::Helpers::SanitizeHelper

  def sanitize_html
    return '' if content.blank?

    content = self.content

    # Remove empty beginning block
    content = content.sub(/^<p><br><\/p>/, '')

    content = sanitize(content, tags: %w(h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img), attributes: %w(class href name target src alt center align))

    # Remplace pre by pre > code
    content = content.gsub(/<pre>/i, '<pre><code>')
    content = content.gsub(/<\/pre>/i, '</code></pre>')

    self.content         = content
    self.private_content = true if has_private_content?
  end

end
