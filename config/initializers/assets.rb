# frozen_string_literal: true

# Ensure assets are overrided for all gems

module ActionView
  module Helpers
    module AssetTagHelper
      def javascript_include_tag(*sources)
        options           = sources.extract_options!.stringify_keys
        path_options      = options.extract!('protocol', 'extname', 'host', 'skip_pipeline').symbolize_keys
        early_hints_links = []

        sources_tags = sources.uniq.map { |source|
          # Change url source
          source = AssetManifest.javascript_path(source)

          href = path_to_javascript(source, path_options)
          early_hints_links << "<#{href}>; rel=preload; as=script"
          tag_options = {
            'src' => href
          }.merge!(options)
          if tag_options['nonce'] == true
            tag_options['nonce'] = content_security_policy_nonce
          end
          content_tag('script', '', tag_options)
        }.join("\n").html_safe

        request.send_early_hints('Link' => early_hints_links.join("\n")) if respond_to?(:request) && request

        sources_tags
      end

      def stylesheet_link_tag(*sources)
        options           = sources.extract_options!.stringify_keys
        path_options      = options.extract!('protocol', 'host', 'skip_pipeline').symbolize_keys
        early_hints_links = []

        sources_tags = sources.uniq.map { |source|
          # Change url source
          source = AssetManifest.stylesheet_path(source)

          href = path_to_stylesheet(source, path_options)
          early_hints_links << "<#{href}>; rel=preload; as=style"
          tag_options = {
            'rel'   => 'stylesheet',
            'media' => 'screen',
            'href'  => href
          }.merge!(options)
          tag(:link, tag_options)
        }.join("\n").html_safe

        request.send_early_hints('Link' => early_hints_links.join("\n")) if respond_to?(:request) && request

        sources_tags
      end

      def favicon_link_tag(source = 'favicon.ico', options = {})
        # Change url source
        source = AssetManifest.image_path(source)

        tag('link', {
          rel:  'shortcut icon',
          type: 'image/x-icon',
          href: path_to_image(source, skip_pipeline: options.delete(:skip_pipeline))
        }.merge!(options.symbolize_keys))
      end
    end
  end
end
