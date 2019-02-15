# frozen_string_literal: true

class Sanitizer
  include ActionView::Helpers::SanitizeHelper

  def sanitize_html(html)
    return '' if html.blank?

    # Remove empty beginning block
    html = html.sub(/^<p><br><\/p>/, '')

    # Keep authorized tags
    html = sanitize(html, tags: %w[h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img picture source iframe], attributes: %w[style class href name target src alt center align frameborder media data-src data-srcset data-article-relation-id])

    # Convert header tags
    html = html.gsub(/<h6( ?)(.*?)>/i, '<h4\1\2>')
    html = html.gsub(/<\/h6>/i, '</h4>')

    html = html.gsub(/<h5( ?)(.*?)>/i, '<h4\1\2>')
    html = html.gsub(/<\/h5>/i, '</h4>')

    if html.include?('<h1')
      html = html.gsub(/<h3( ?)(.*?)>/i, '<h4\1\2>')
      html = html.gsub(/<\/h3>/i, '</h4>')

      html = html.gsub(/<h2( ?)(.*?)>/i, '<h3\1\2>')
      html = html.gsub(/<\/h2>/i, '</h3>')

      html = html.gsub(/<h1( ?)(.*?)>/i, '<h2\1\2>')
      html = html.gsub(/<\/h1>/i, '</h2>')
    end

    # Simplify code tags
    html = html.gsub(/(<code( *)>){2,}/i, '<code>')
    html = html.gsub(/(<\/code>){2,}/i, '</code>')
    html = html.gsub(/<code><br><\/code>/i, '')

    # Replace "pre" by "pre > code"
    html = html.gsub(/<pre( ?)(.*?)>/i, '<pre\1\2><code>')
    html = html.gsub(/<\/pre>/i, '</code></pre>')

    # Replace src by data-src for lazy-loading
    # html = html.gsub(/<img (.*?) ?src=/i, '<img \1 class="lazyload" data-src=') if lazy_image

    # Improve link security
    html = html.gsub(/<a /i, '<a rel="noopener noreferrer" target="_blank" ')

    return html
  end
end
