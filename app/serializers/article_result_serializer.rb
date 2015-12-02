class ArticleResultSerializer < ActiveModel::Serializer
  cache key: 'article_result', expires_in: 12.hours

  attributes :id, :slug, :title, :summary, :content, :visibility, :is_link, :show, :highlight_content

  belongs_to :author, serializer: UserSerializer
  has_many :tags
  has_many :parent_tags, serializer: TagSerializer
  has_many :child_tags, serializer: TagSerializer

  def content
    current_user_id = (defined?(current_user) && current_user) ? current_user.id : nil
    object.adapted_content(current_user_id)
  end

  def show
    true
  end

  def highlight_content
    if !options[:highlight].empty? && options[:highlight][object.id]
      if defined?(current_user) && current_user && current_user.id == object.id
        options[:highlight][object.id]["content_#{I18n.locale.to_s}".to_sym]
      else
        options[:highlight][object.id]["public_content_#{I18n.locale.to_s}".to_sym]
      end
    end
  end
end
