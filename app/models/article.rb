# == Schema Information
#
# Table name: articles
#
#  id              :integer          not null, primary key
#  author_id       :integer          not null
#  visibility      :integer          default(0), not null
#  notation        :integer          default(0)
#  priority        :integer          default(0)
#  allow_comment   :boolean          default(FALSE), not null
#  private_content :boolean          default(FALSE), not null
#  is_link         :boolean          default(FALSE), not null
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class Article < ActiveRecord::Base

  # Associations
  belongs_to :author, class_name: 'User'

  ## Comment
  # has_many :comments, as: :commentable

  ## Tags
  has_many :tags, through: :tagged_articles, autosave: true
  has_many :tagged_articles
  accepts_nested_attributes_for :tags, reject_if: :all_blank, update_only: true, allow_destroy: false
  has_many :parent_tags,
           -> { where(tagged_articles: {parent: true}) },
           through: :tagged_articles,
           source: :tag
  has_many :child_tags,
           -> { where(tagged_articles: {child: true}) },
           through: :tagged_articles,
           source: :tag

  def tags_attributes=(tags_attrs)
    article_tags = []
    parent_tags = []
    child_tags = []
    tags_attrs.each do |_tagKey, tagValue|
      next unless tagValue
      tag_id = tagValue.delete(:id)
      next unless tag_id

      tag = Tag.find_or_initialize_by(id: tag_id)

      parent = tagValue.delete(:parent)
      child = tagValue.delete(:child)

      tag.attributes = tagValue

      parent_tags << tag if parent && !parent.blank?
      child_tags << tag if child && !child.blank?
      article_tags << tag
    end
    self.parent_tags = parent_tags
    self.child_tags = child_tags
    self.tags = article_tags
  end

  ## Picture
  has_many :picture, as: :imageable, autosave: true, dependent: :destroy
  accepts_nested_attributes_for :picture, allow_destroy: true, reject_if: lambda {
                                            |picture| picture['image'].blank? && picture['image_tmp'].blank?
                                        }

  # Scopes
  scope :user_related, -> (user_id = nil) { where('articles.visibility = 0 OR (articles.visibility = 1 AND author_id = :author_id)',
                                                  author_id: user_id).includes(:author, :tags, :translations) }

  # Parameters validation
  validates :author_id, presence: true
  validates :title,
            length: {minimum: 1, maximum: 128},
            if: 'title.present?'
  validates :summary,
            length: {minimum: 1, maximum: 256},
            if: 'summary.present?'
  validates :content,
            presence: true,
            length: {minimum: 3, maximum: 12_000}

  # Sanitize and detect programming language if any before save
  before_save :sanitize_html

  # Translation
  translates :title, :summary, :content, fallbacks_for_empty_translations: true
  accepts_nested_attributes_for :translations, allow_destroy: true

  # Enum
  include Shared::EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('article', [:visibility])

  # Nice url format
  include Shared::NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Friendly ID
  def slug_candidates
    [
        :title,
        [:title, :summary]
    ]
  end

  # Elastic Search
  searchkick autocomplete: [:title, :tags],
             suggest: [:title, :tags],
             highlight: [:content_en, :content_fr, :public_content_en, :public_content_fr],
             include: [:author, :tags, :translations],
             language: (I18n.locale == :fr) ? 'French' : 'English'
  # wordnet: true,

  # after_commit :reindex_product
  # def reindex_product
  #   tags.reindex # or reindex_async
  # end

  def search_data
    {
        author_id: author.id,
        title: title,

        public_content_en: public_content('en'),
        public_content_fr: public_content('fr'),

        content_en: strip_content('en'),
        content_fr: strip_content('fr'),
        summary: summary,
        tags: tags.pluck(:name)
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
    # If query not defined, search for everything
    query_string = query ? query : '*'

    # Fields with boost
    fields = if I18n.locale == :fr
               %w(title^10 content_fr^5 content_en public_content_fr public_content_en)
             else
               %w(title^10 content_en^5 content_fr public_content_en public_content_fr)
             end

    # Highlight results and select a fragment
    # highlight = options[:highlight] ? {fields: {content: {fragment_size: 200}}, tag: '<span class="blog-highlight">'} : false
    highlight = true

    # Include tag in search, all tags: options[:tags] ; at least one tag: {all: options[:tags]}
    where_options = {}
    where_options[:tags] = {all: options[:tags]} if options[:tags]

    # Choose operator : 'and' or 'or'
    operator = options[:operator] ? options[:operator] : 'and'

    # Boost user articles first
    boost_where = options[:current_user_id] ? {author_id: options[:current_user_id]} : nil

    # Misspelling, specify number of characters
    misspellings_distance = options[:exact] ? 0 : 1

    # Perform search
    results = Article.search(query_string,
                             fields: fields,
                             boost_where: boost_where,
                             highlight: highlight,
                             misspellings: {edit_distance: misspellings_distance},
                             suggest: true,
                             page: options[:page],
                             per_page: options[:per_page],
                             operator: operator,
                             where: where_options
    )

    words = Article.searchkick_index.tokens(query_string, analyzer: 'searchkick_search2') & query_string.squish.split(' ')

    {
        articles: results.records,
        highlight: Hash[results.with_details.map { |article, details| [article.id, details[:highlight]] }],
        suggestions: results.suggestions,
        words: words.uniq
    }
  end

  def adapted_content(current_user_id, highlight = nil, locale = nil)
    content = self.content

    if highlight
      # Adapt current language
      if I18n.locale == :fr && !highlight[:content_fr] && highlight[:content_en]
        content = self.translations.find_by(locale: 'en').content
      elsif I18n.locale == :en && !highlight[:content_en] && highlight[:content_fr]
        content = self.translations.find_by(locale: 'fr').content
      end

      if self.private_content && self.author.id != current_user_id
        if (highlight[:content_fr] && !highlight[:public_content_fr]) || (highlight[:content_en] && !highlight[:public_content_en])
          content = nil
        else
          content = content.gsub(/<(\w+) class="secret">(.*?)<\/\1>/im, '')
        end
      end
    else
      if self.private_content && self.author.id != current_user_id
        content = self.public_content(locale)
      elsif locale
        content = translations.find_by(locale: locale).content
      end
    end

    return content
  end

  # Sanitize content
  include ActionView::Helpers::SanitizeHelper

  def sanitize_html
    content = self.content

    # Remove empty beginning block
    content = content.sub(/^<p><br><\/p>/, '')

    content = sanitize(content, tags: %w(h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img), attributes: %w(class href name target src alt center align))

    # Remplace pre by pre > code
    content = content.gsub(/<pre>/i, '<pre><code>')
    content = content.gsub(/<\/pre>/i, '</code></pre>')

    self.content = content
    self.private_content = true if has_private_content?
  end

  def to_builder(current_user_id, multi_language = false)
    Jbuilder.new do |article|
      article.id id
      article.author author.pseudo
      article.author_id author.id
      article.title title
      article.summary summary
      article.content adapted_content(current_user_id)
      article.visibility visibility
      article.is_link is_link

      if multi_language
        article.id_en translations.find_by(locale: 'en').id
        article.title_en translations.find_by(locale: 'en').title
        article.summary_en translations.find_by(locale: 'en').summary
        article.content_en adapted_content(current_user_id, nil, 'en')

        article.id_fr translations.find_by(locale: 'fr').id
        article.title_fr translations.find_by(locale: 'fr').title
        article.summary_fr translations.find_by(locale: 'fr').summary
        article.content_fr adapted_content(current_user_id, nil, 'fr')
      end

      article.tags tags, :id, :name, :slug
    end
  end

end
