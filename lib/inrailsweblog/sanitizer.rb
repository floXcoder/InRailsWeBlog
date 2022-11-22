# frozen_string_literal: true

class Sanitizer
  include ActionView::Helpers::SanitizeHelper

  def sanitize_html(html)
    return nil if html.blank?
    return nil if %w[<br> <br/> <p><br></p>].include?(html)

    # Remove empty beginning block
    html = html.sub(/^<p><br><\/p>/, '')

    # Remove empty blocks
    html = html.gsub(/<p><\/p>/, '')

    # # Replace return to line by br tag
    # html = html.gsub(/(?:\r\n|\r|\n)/, '<br/>')

    # Keep authorized tags
    html = sanitize(html, tags: %w[h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img picture source iframe], attributes: %w[style class href name target rel src alt center align frameborder media data-src data-srcset data-article-relation-id])

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

    # Replace all br tags by simple return to line
    html = html.gsub(/<pre(.*?)>(.*?)<\/pre>/mi) { |b| b.gsub(/<br(\/?)>/, "\n") }

    # Simplify code tags
    html = html.gsub(/<code(.*?)>/i, '<code>')
    # html = html.gsub(/(<code>){2,}/i, '<code>')
    # html = html.gsub(/(<\/code>){2,}/i, '</code>')
    html = html.gsub(/<code><br><\/code>/i, '')

    # Replace "pre" by "pre > code" => pre only is used for code block
    # html = html.gsub(/<pre( ?)(.*?)><code>/i, '<pre\1\2>')
    # html = html.gsub(/<\/code><\/pre>/i, '</pre>')

    # Replace src by data-src for lazy-loading
    # html = html.gsub(/<img (.*?) ?src=/i, '<img \1 class="lazyload" data-src=') if lazy_image

    # Improve link security
    html = html.gsub(/<a /i, '<a rel="noopener noreferrer" target="_blank" ')

    return html
  end

  def remove_secrets(html)
    html&.gsub(/<(\w+) class="secret">(.*?)<\/\1>/im, '')
  end
end
