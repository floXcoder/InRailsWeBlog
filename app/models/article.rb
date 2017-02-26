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
#  draft                 :boolean          default(FALSE), not null
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

class Article < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('article', [:visibility])

  # Strip whitespaces
  auto_strip_attributes :title, :summary, :language

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
  acts_as_tracked :queries, :searches, :comments, :clicks, :views

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :user

  # Nice url format
  include NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Search
  searchkick searchable:  [:title, :summary, :content, :reference, :tags],
             word_middle: [:title, :summary, :content],
             suggest:     [:title, :summary],
             highlight:   [:content],
             language:    (I18n.locale == :fr) ? 'French' : 'English'

  # == Relationships ========================================================
  belongs_to :user,
             class_name:    'User',
             counter_cache: true

  belongs_to :topic,
             counter_cache: true

  has_many :tagged_articles
  has_many :tags,
           through:  :tagged_articles,
           autosave: true
  has_many :parent_tags,
           -> { where(tagged_articles: { parent: true }) },
           through: :tagged_articles,
           source:  :tag
  has_many :child_tags,
           -> { where(tagged_articles: { child: true }) },
           through: :tagged_articles,
           source:  :tag
  # accepts_nested_attributes_for :tags,
  #                               reject_if:     :all_blank,
  #                               update_only:   true,
  #                               allow_destroy: false

  has_many :pictures,
           -> { order 'created_at ASC' },
           as:        :imageable,
           autosave:  true,
           dependent: :destroy
  accepts_nested_attributes_for :pictures, allow_destroy: true, reject_if: lambda {
    |picture| picture['picture'].blank? && picture['image_tmp'].blank?
  }

  has_many :outdated_articles
  has_many :marked_as_outdated,
           through: :outdated_articles,
           source:  :user

  has_many :bookmarked,
           as:          :bookmarked,
           class_name:  'Bookmark',
           foreign_key: 'bookmarked_id',
           dependent:   :destroy
  has_many :user_bookmarks,
           through: :bookmarked,
           source:  :user

  has_many :follower,
           -> { where(bookmarks: { follow: true }) },
           through: :bookmarked,
           source:  :user

  has_many :activities,
           as:         :trackable,
           class_name: 'PublicActivity::Activity'

  # == Validations ==========================================================
  validates :user,
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
  scope :everyone_and_user, -> (user_id = nil) {
    where('articles.visibility = 0 OR (articles.visibility = 1 AND articles.user_id = :user_id)',
          user_id: user_id)
  }

  scope :with_visibility, -> (visibility) {
    where(visibility: (visibility.is_a?(String) ? Article.visibilities[visibility] : visibility))
  }

  scope :from_user, -> (user_id = nil, current_user_id = nil) {
    where(user_id: user_id).where('articles.visibility = 0 OR (articles.visibility = 1 AND articles.user_id = :current_user_id)',
                                  current_user_id: current_user_id)
  }

  scope :with_tags, -> (tags) { joins(:tags).where(tags: { name: tags }) }
  scope :with_parent_tags, -> (parent_tags) { joins(:tags).where(tagged_articles: { parent: true }, tags: { name: parent_tags }) }
  scope :with_child_tags, -> (child_tags) { joins(:tags).where(tagged_articles: { child: true }, tags: { name: child_tags }) }

  scope :published, -> { where(draft: false) }

  scope :bookmarked_by_user,
        -> (user_id) { joins(:bookmarked).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id }) }

  # == Callbacks ============================================================

  # == Class Methods ========================================================
  # Article Search
  # +query+ parameter: string to query
  # +options+ parameter:
  #  current_user_id (current user id)
  #  current_topic_id (current topic id for current user)
  #  page (page number for pagination)
  #  per_page (number of articles per page for pagination)
  #  exact (exact search or include misspellings, default: 2)
  #  tags (array of tags associated with articles)
  #  operator (array of tags associated with articles, default: AND)
  #  highlight (highlight content, default: true)
  #  exact (do not misspelling, default: false, 1 character)
  def self.search_for(query, options = {})
    return { articles: [] } if Article.count.zero?

    # If query not defined or blank, search for everything
    query_string          = !query || query.blank? ? '*' : query

    # Fields with boost
    fields                = %w(title^10 summary^5 content)

    # Misspelling: use exact search if query has less than 7 characters and perform another using misspellings search if less than 3 results
    misspellings_distance = options[:exact] || query_string.length < 7 ? 0 : 2
    misspellings_retry    = 3

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
    end.to_h if options[:where]

    where_options        ||= {}

    where_options[:tags] = { all: options[:tags] } if options[:tags]

    # Aggregations
    aggregations         = {
      notation: { where: { notation: { not: 0 } } },
      tags:     {}
    }

    # Boost user articles first
    boost_where          = {}
    boost_where[:user_id] = options[:current_user_id] if options[:current_user_id]
    boost_where[:topic_id] = options[:current_topic_id] if options[:current_topic_id]

    # Page parameters
    page                 = options[:page] ? options[:page] : 1
    per_page             = options[:per_page] ? options[:per_page] : CONFIG.per_page

    # Order search
    if options[:order]
      order = if options[:order] == 'id_first'
                { id: :asc }
              elsif options[:order] == 'id_last'
                { id: :desc }
              elsif options[:order] == 'created_first'
                { created_at: :asc }
              elsif options[:order] == 'created_last'
                { created_at: :desc }
              elsif options[:order] == 'updated_first'
                { updated_at: :asc }
              elsif options[:order] == 'updated_last'
                { updated_at: :desc }
              elsif options[:order] == 'rank_first'
                { rank: :asc }
              elsif options[:order] == 'rank_last'
                { rank: :desc }
              elsif options[:order] == 'popularity_first'
                { popularity: :asc }
              elsif options[:order] == 'popularity_last'
                { popularity: :desc }
              end
    end

    # Perform search
    results = Article.search(query_string,
                             fields:       fields,
                             boost_where:  boost_where,
                             highlight:    highlight,
                             match:        :word_middle,
                             misspellings: { below: misspellings_retry, edit_distance: misspellings_distance },
                             suggest:      true,
                             page:         page,
                             per_page:     per_page,
                             operator:     operator,
                             where:        where_options,
                             order:        order,
                             aggs:         aggregations,
                             includes:     [:user, :tags])

    # words_search = Article.searchkick_index.tokens(query_string, analyzer: 'searchkick_search2') & query_string.squish.split(' ')

    formatted_aggregations = {}
    results.aggs.each do |key, value|
      formatted_aggregations[key] = value['buckets'].map { |data| [data['key'], data['doc_count']] }.to_h unless value['buckets'].empty?
    end

    # Track search results
    Article.track_searches(results.records.ids)

    articles = results.records
    articles = articles.includes(:user, :tags)
    articles = articles.order_by(options[:order]) if order

    {
      articles:    articles.records,
      highlight:    highlight ? Hash[results.with_details.map { |article, details| [article.id, details[:highlight]] }] : [],
      suggestions:  results.suggestions,
      aggregations: formatted_aggregations,
      total_count:  results.total_count,
      total_pages:  results.total_pages
      # words:       words_search.uniq
    }
  end

  def self.autocomplete_for(query, options = {})
    return Article.none if Article.count.zero?

    # If query not defined or blank, search for everything
    query_string  = !query || query.blank? ? '*' : query

    # Where options only for ElasticSearch
    where_options = options[:where].compact.map do |key, value|
      [key, value]
    end.to_h if options[:where]

    # Set result limit
    limit         = options[:limit] ? options[:limit] : CONFIG.per_page

    # Perform search
    results       = Article.search(query_string,
                                   fields:       %w(name^3 summary),
                                   match:        :word_middle,
                                   misspellings: false,
                                   load:         false,
                                   where:        where_options,
                                   limit:        limit)

    return results.map do |article|
      {
        name:    article.name,
        summary: article.summary,
        icon:    'article',
        link:    Rails.application.routes.url_helpers.article_path(article.slug)
      }
    end
  end

  def self.order_by(order)
    if order == 'id_first'
      order('id ASC')
    elsif order == 'id_last'
      order('id DESC')
    elsif order == 'created_first'
      order('created_at ASC')
    elsif order == 'created_last'
      order('created_at DESC')
    elsif order == 'updated_first'
      order('updated_at ASC')
    elsif order == 'updated_last'
      order('updated_at DESC')
    elsif order == 'rank_first'
      joins(:tracker).order('rank ASC')
    elsif order == 'rank_last'
      joins(:tracker).order('rank DESC')
    elsif order == 'popularity_first'
      joins(:tracker).order('popularity ASC')
    elsif order == 'popularity_last'
      joins(:tracker).order('popularity DESC')
    else
      self
    end
  end

  # == Instance Methods =====================================================
  def user?(user)
    user.id == self.user_id if user
  end

  def format_attributes(attributes = {}, current_user = nil)
    # Topic: Add current topic to article
    self.topic_id = current_user.current_topic_id if current_user

    # Language: set current locale for now
    self.language = current_user ? current_user.locale : I18n.locale

    # Sanitization
    unless attributes[:title].nil?
      sanitized_title = Sanitize.fragment(attributes.delete(:title))
      self.slug       = nil if sanitized_title != self.title
      self.title      = sanitized_title
    end

    unless attributes[:summary].nil?
      self.summary = Sanitize.fragment(attributes.delete(:summary))
    end

    unless attributes[:content].nil?
      self.content = sanitize_html(attributes.delete(:content))
    end

    unless attributes[:reference].nil?
      reference_url  = ActionController::Base.helpers.sanitize(attributes.delete(:reference))
      reference_url  = "http://#{reference_url}" if reference_url.present? && reference_url !~/^https?:\/\//
      self.reference = reference_url
    end

    # Tags
    # self.tags        = article_tags = []
    self.parent_tags = parent_tags = []
    self.child_tags  = child_tags = []
    unless attributes[:parent_tags].nil?
      parent_tags = Tag.parse_tags(attributes.delete(:parent_tags), current_user&.id)
    end
    unless attributes[:child_tags].nil?
      child_tags = Tag.parse_tags(attributes.delete(:child_tags), current_user&.id)
    end
    self.parent_tags = parent_tags
    self.child_tags  = child_tags
    # self.tags        = (parent_tags + child_tags).uniq

    # Pictures
    if attributes[:pictures].present? && attributes[:pictures].is_a?(Array)
      attributes.delete(:pictures).each do |pictureId|
        self.pictures << Picture.find_by(id: pictureId.to_i) if pictureId.present?
      end
    else
      attributes.delete(:pictures)
    end

    self.assign_attributes(attributes)
  end

  def default_picture
    default_picture = ''

    picture = if self.pictures_count > 0
                self.pictures.order('priority DESC').first.image.thumb.url
              else
                default_picture
              end

    return AssetManifest.image_path(picture || default_picture)
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

  def bookmarked?(user)
    user ? user_bookmarks.include?(user) : false
  end

  def followed?(user)
    user ? follower.include?(user) : false
  end

  def slug_candidates
    "#{title}_at_#{user.pseudo}"
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
    if has_private_content? && self.user_id != current_user_id
      public_content
    else
      content
    end
  end

  def summary_content(current_user_id = nil)
    adapted_content(current_user_id).summary
  end

  # Sanitize content
  include ActionView::Helpers::SanitizeHelper

  def sanitize_html(html)
    return unless html
    return '' if html.blank?

    # Remove empty beginning block
    html = html.sub(/^<p><br><\/p>/, '')

    html = sanitize(html, tags: %w(h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img), attributes: %w(class href name target src alt center align))

    # Remplace pre by pre > code
    html = html.gsub(/<pre>/i, '<pre><code>')
    html = html.gsub(/<\/pre>/i, '</code></pre>')

    return html
  end

  def search_data
    {
      id:             id,
      user_id:        user_id,
      topic_id:       topic_id,
      topic_name:     topic.name,
      topic_slug:     topic.slug,
      title:          title,
      summary:        summary,
      content:        strip_content,
      public_content: public_content,
      reference:      reference,
      notation:       notation,
      priority:       priority,
      draft:          draft,
      language:       language,
      visibility:     visibility,
      archived:       archived,
      accepted:       accepted,
      tags:           tags.pluck(:name),
      created_at:     created_at,
      updated_at:     updated_at,
      rank:           rank,
      popularity:     popularity,
      slug:           slug
    }
  end

end
