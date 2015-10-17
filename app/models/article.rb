# == Schema Information
#
# Table name: articles
#
#  id            :integer          not null, primary key
#  author_id     :integer          not null
#  visibility    :integer          default(0), not null
#  notation      :integer          default(0)
#  priority      :integer          default(0)
#  allow_comment :boolean          default(FALSE), not null
#  slug          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
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
           -> { where(tagged_articles: { parent: true }) },
           through: :tagged_articles,
           source: :tag
  has_many :child_tags,
           -> { where(tagged_articles: { child: true }) },
           through: :tagged_articles,
           source: :tag

  def tags_attributes=(tags_attrs)
    article_tags = []
    parent_tags = []
    child_tags = []
    tags_attrs.each do |_tagKey, tagValue|
      tag = Tag.find_or_initialize_by(id: tagValue.delete(:id))

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
                                                  author_id: user_id).with_translations(I18n.locale).includes(:author, :tags) }

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

  # Sanitize before save
  before_save :sanitize_html

  # Translation
  translates :title, :summary, :content, fallbacks_for_empty_translations: true

  # Enum
  include Shared::EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('article', [:visibility])

  # Nice url format
  include Shared::NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Elastic Search
  searchkick autocomplete: [:title, :tags],
             suggest: [:title, :tags],
             highlight: [:content],
             language: (I18n.locale == :en) ? 'English' : 'French'
  # wordnet: true,

  # after_commit :reindex_product
  # def reindex_product
  #   tags.reindex # or reindex_async
  # end

  def search_data
    {
        author_id: author.id,
        title: title,
        content: content,
        summary: summary,
        tags: tags.pluck(:name)
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
    article_request = Article.user_related(options[:current_user_id])

    # If query not defined, search for everything
    query_string = query ? query : '*'

    # Misspelling, specify number of characters
    misspellings_distance = options[:exact] ? 0 : 1

    # Highlight results and select a fragment
    highlight = options[:highlight] ? {fields: {content: {fragment_size: 200}}, tag: '<span class="blog-highlight">'} : false

    # Include tag in search, all tags: options[:tags] ; at least one tag: {all: options[:tags]}
    where_options = {}
    where_options[:tags] = {all: options[:tags]} if options[:tags]

    # Choose operator : 'and' or 'or'
    operator = options[:operator] ? options[:operator] : 'and'

    # Boost user articles first
    boost_where = options[:current_user_id] ? {author_id: options[:current_user_id]} : nil

    # Perform search
    article_request.search(query_string,
                           fields: ['title^3', :content],
                           boost_where: boost_where,
                           highlight: highlight,
                           misspellings: {edit_distance: misspellings_distance},
                           suggest: true,
                           page: options[:page],
                           per_page: options[:per_page],
                           operator: operator,
                           where: where_options
    )
  end

  # Sanitize content
  include ActionView::Helpers::SanitizeHelper

  def sanitize_html
    content = self.content.sub(/^<p><br><\/p>/, '')
    content = sanitize(content, tags: %w(h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img), attributes: %w(href name target src alt center align))
    self.content = content
  end

  # Friendly ID
  def slug_candidates
    [
        :title,
        [:title, :summary]
    ]
  end

end
