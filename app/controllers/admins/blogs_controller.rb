# frozen_string_literal: true

class Admins::BlogsController < AdminsController
  before_action :verify_requested_format!

  respond_to :html, :json

  def index
    respond_to do |format|
      format.html do
        set_meta_tags title:   titleize_admin(I18n.t('views.admin.blogs.title')),
                      noindex: true, nofollow: true

        render :index
      end

      format.json do
        blogs = Admin::Blog.all

        render json: Admin::BlogSerializer.new(blogs,
                                               meta: { root: 'blogs' }).serializable_hash
      end
    end
  end

  def create
    article = current_admin.blogs.build(blog_params)

    respond_to do |format|
      format.json do
        if article.save
          flash.now[:success] = t('views.admin.blog.flash.successful_creation')
          render json:   Admin::BlogSerializer.new(article).serializable_hash,
                 status: :created
        else
          flash.now[:error] = t('views.admin.blog.flash.error_creation')
          render json:   { errors: article.errors },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def update
    article = Admin::Blog.find(params[:id])

    respond_to do |format|
      format.json do
        if article.update(blog_params)
          flash.now[:success] = t('views.admin.blog.flash.successful_edition')
          render json:   Admin::BlogSerializer.new(article).serializable_hash,
                 status: :ok
        else
          flash.now[:error] = t('views.admin.blog.flash.error_edition')
          render json:   { errors: article.errors },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def destroy
    article = Admin::Blog.find(params[:id])

    respond_to do |format|
      if article.destroy
        flash.now[:success] = t('views.admin.blog.flash.successful_deletion')
        format.json do
          render json:   { redirect: admins_path },
                 status: :accepted
        end
      else
        flash.now[:error] = t('views.admin.blog.flash.error_deletion')
        format.json do
          render json:   { errors: article.errors },
                 status: :unprocessable_entity
        end
      end
    end
  end

  private

  def blog_params
    params.require(:blog).permit(:title,
                                 :content)
  end

end
