# == Schema Information
#
# Table name: articles
#
#  id              :integer          not null, primary key
#  author_id       :integer          not null
#  visibility      :integer          default(0), not null
#  notation        :integer          default(0)
#  priority        :integer          default(0)
#  allow_comment   :boolean          default(TRUE), not null
#  private_content :boolean          default(FALSE), not null
#  is_link         :boolean          default(FALSE), not null
#  temporary       :boolean          default(FALSE), not null
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class Article < ActiveRecord::Base

  # Associations
  belongs_to :author, class_name: 'User'

  def author?(user)
    user.id == self.author_id
  end

  # Enum
  include EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('article', [:visibility])

  # Scopes
  scope :user_related, -> (user_id = nil) {
    where('articles.visibility = 0 OR (articles.visibility = 1 AND articles.author_id = :author_id)',
          author_id: user_id)
  }
  scope :published, -> { where(temporary: false) }

  # Parameters validation
  validates :author_id, presence: true
  validates :title,
            length: { minimum: CONFIG.title_min_length, maximum: CONFIG.title_max_length },
            if:     'title.present?'
  validates :summary,
            length: { minimum: CONFIG.summary_min_length, maximum: CONFIG.summary_max_length },
            if:     'summary.present?'
  validates :content,
            presence: true,
            length:   { minimum: CONFIG.content_min_length, maximum: CONFIG.content_max_length }
  validates :notation, inclusion: 0..5

  # Sanitize and detect programming language if any before save
  before_save :sanitize_html

  # Tags
  has_many :tagged_articles
  has_many :tags, through: :tagged_articles
  has_many :parent_tags,
           -> { where(tagged_articles: { parent: true }) },
           through: :tagged_articles,
           source:  :tag
  has_many :child_tags,
           -> { where(tagged_articles: { child: true }) },
           through: :tagged_articles,
           source:  :tag
  accepts_nested_attributes_for :tags, reject_if: :all_blank, update_only: true, allow_destroy: false

  def tags_attributes=(tags_attrs)
    self.tags        = article_tags = []
    self.parent_tags = parent_tags = []
    self.child_tags  = child_tags = []

    tags_attrs.each do |_tagKey, tagValue|
      next unless tagValue

      tag_id        = tagValue.delete(:id)
      tag           = if !tag_id.blank?
                        Tag.find_or_initialize_by(id: tag_id)
                      else
                        Tag.find_or_initialize_by(name: tagValue[:name])
                      end
      tag.tagger_id = self.author.id unless tag.tagger_id

      parent = tagValue.delete(:parent)
      child  = tagValue.delete(:child)

      tag.attributes = tagValue

      if parent && !parent.blank?
        parent_tags << tag
      elsif child && !child.blank?
        child_tags << tag
      else
        article_tags << tag
      end
    end

    self.tags        = article_tags
    self.parent_tags = parent_tags
    self.child_tags  = child_tags
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

  # Bookmarks
  has_many :bookmarked_articles
  has_many :user_bookmarks,
           through: :bookmarked_articles,
           source:  :user

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
      errors.add(:bookmark, I18n.t('activerecord.errors.models.bookmark.no_bookmarked'))
    else
      return self.user_bookmarks.delete(user)
    end
  end

  # Translation
  translates :title, :summary, :content,
             fallbacks_for_empty_translations: true,
             versioning:                       { gem: :paper_trail, options: { on: [:update, :destroy] } }
  accepts_nested_attributes_for :translations, allow_destroy: true

  # Versioning
  has_paper_trail on: [:destroy], ignore: [:title, :summary, :content]

  # Comments
  include CommentableConcern

  # Track activities
  include ActAsTrackedConcern
  acts_as_tracked '_InRailsWeBlog_', :queries, :searches, :comments, :bookmarks, :clicks, :views

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :author
  has_many :activities, as: :trackable, class_name: 'PublicActivity::Activity'

  # Nice url format
  include NiceUrlConcern
  friendly_id :article_at_user, use: :slugged

  def article_at_user
    "#{title}_at_#{author.pseudo}"
  end

  def normalize_friendly_id(_string)
    super.gsub('-', '_').gsub('_at_', '@')
  end

  def should_generate_new_friendly_id?
    translation = translations.where(locale: I18n.locale).first
    if translation
      (translation.title != self.title)
    else
      super
    end
  end

  # Elastic Search
  searchkick autocomplete: [:title, :tags],
             suggest:      [:title, :tags],
             highlight:    [:content_en, :content_fr, :public_content_en, :public_content_fr],
             include:      [:author, :tags, :translations, :parent_tags, :child_tags],
             language:     (I18n.locale == :fr) ? 'French' : 'English'

  def search_data
    {
      author_id:         author_id,
      title:             title,
      summary:           summary,
      public_content_en: public_content('en'),
      public_content_fr: public_content('fr'),
      content_en:        strip_content('en'),
      content_fr:        strip_content('fr'),
      tags:              tags.pluck(:name)
    }
  end

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
    query_string             = !query || query.blank? ? '*' : query

    # Fields with boost
    fields                = if I18n.locale == :fr
                              %w(title^10 content_fr^5 content_en public_content_fr public_content_en)
                            else
                              %w(title^10 content_en^5 content_fr public_content_en public_content_fr)
                            end

    # Misspelling, specify number of characters
    misspellings_distance = options[:exact] ? 0 : 1

    # Operator type: 'and' or 'or'
    operator              = options[:operator] ? options[:operator] : 'and'

    # Highlight results and select a fragment
    # highlight = options[:highlight] ? {fields: {content: {fragment_size: 200}}, tag: '<span class="blog-highlight">'} : false
    highlight             = {tag: '<span class="blog-highlight">'}

    # Include tag in search, all tags: options[:tags] ; at least one tag: {all: options[:tags]}
    where_options         = {}
    where_options[:tags]  = { all: options[:tags] } if options[:tags]

    # Boost user articles first
    boost_where           = options[:current_user_id] ? { author_id: options[:current_user_id] } : nil

    # Perform search
    results               = Article.search(query_string,
                                           fields:       fields,
                                           boost_where:  boost_where,
                                           highlight:    highlight,
                                           misspellings: { edit_distance: misspellings_distance },
                                           suggest:      true,
                                           page:         options[:page],
                                           per_page:     options[:per_page],
                                           operator:     operator,
                                           where:        where_options)

    words_search = Article.searchkick_index.tokens(query_string, analyzer: 'searchkick_search2') & query_string.squish.split(' ')

    # Track search results
    Article.track_searches(results.records.ids)

    {
      articles:    results.records,
      highlight:   Hash[results.with_details.map { |article, details| [article.id, details[:highlight]] }],
      suggestions: results.suggestions,
      words:       words_search.uniq
    }
  end

  def strip_content(locale = nil)
    if locale
      locale_article = self.translations.where(locale: locale)[0]
      sanitize(locale_article ? locale_article.content.gsub(/(<\/\w+>)/i, '\1 ') : '', tags: [], attributes: []).squish
    else
      sanitize(self.content.gsub(/(<\/\w+>)/i, '\1 '), tags: [], attributes: []).squish
    end
  end

  def public_content(locale = nil)
    if locale && self.translations.find_by(locale: locale)
      self.translations.find_by(locale: locale).content.gsub(/<(\w+) class="secret">(.*?)<\/\1>/im, '')
    else
      self.content.gsub(/<(\w+) class="secret">(.*?)<\/\1>/im, '')
    end
  end

  def has_private_content?
    self.content =~ /<(\w+) class="secret">.*?<\/\1>/im
  end

  def adapted_content(current_user_id, locale = nil)
    if self.private_content && self.author.id != current_user_id
      self.public_content(locale)
    elsif locale
      translations.find_by(locale: locale).content
    else
      self.content
    end
  end

  def summary_content(current_user_id = nil, locale = nil)
    adapted_content(current_user_id, locale).summary
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
