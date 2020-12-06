xml.instruct! :xml, version: '1.0'

xml.rss version: '2.0' do
  xml.channel do
    xml.title home_data.page_title
    xml.description home_data.meta_desc
    xml.link Rails.application.routes.url_helpers.send("home_#{locale}_url", host: ENV['WEBSITE_FULL_ADDRESS'])
    xml.language locale

    articles.each do |article|
      next unless article.title.present? && article.content.present?

      xml.item do
        xml.title article.title
        xml.description article.content.summary(InRailsWeBlog.config.seo_meta_desc_length, true)
        xml.pubDate article.created_at.to_s(:rfc822)
        xml.author_name article.user.pseudo
        xml.link article.link_path(host: true, locale: locale)
        xml.guid article.link_path(host: true, locale: locale)
        xml.icon AssetManifest.image_path('favicon.ico')
      end
    end
  end
end
