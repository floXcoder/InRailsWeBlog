# == Schema Information
#
# Table name: admin_blogs
#
#  id         :bigint           not null, primary key
#  admin_id   :bigint           not null
#  visibility :integer          default(0), not null
#  title      :string           not null
#  content    :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Admin::Blog < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum mode: ARTICLE_MODE
  enums_to_tr('blog', [:visibility])

  auto_strip_attributes :title

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :admin

  # == Validations ==========================================================
  validates :title,
            presence: true,
            length:   { minimum: InRailsWeBlog.config.admin_blog_title_min_length, maximum: InRailsWeBlog.config.admin_blog_title_max_length }

  validates :content,
            presence: true,
            length:   { minimum: InRailsWeBlog.config.admin_blog_content_min_length, maximum: InRailsWeBlog.config.admin_blog_content_max_length }

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================
  def user?(admin)
    admin&.id == self.admin_id
  end

  def format_attributes(attributes = {})
    # Sanitization
    unless attributes[:title].nil?
      sanitized_title = Sanitize.fragment(attributes.delete(:title))
      self.slug       = nil if sanitized_title != self.title
      self.title      = sanitized_title
    end

    unless attributes[:content].nil?
      self.content = sanitize_html(attributes.delete(:content))
    end

    self.assign_attributes(attributes)
  end

  private

  def sanitize_html(html)
    return unless html
    return '' if html.blank?

    return Sanitize.fragment(html, elements: %w[p blockquote h1 h2 h3 h4 strong em a img strike br ul ol li], attributes: { 'img' => ['src', 'alt'], 'p' => ['style'], 'a' => ['href', 'title'], protocols: { 'a' => { 'href' => ['http', 'https', 'mailto'] } } }, css: { properties: ['text-align'] })
  end

end
