# frozen_string_literal: true

class Admins::BlogsController < AdminsController
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
                                               meta: { root: 'blogs' })
      end
    end
  end

  def create
    blog = current_admin.blogs.build(blog_params)

    respond_to do |format|
      format.json do
        if blog.save
          flash.now[:success] = t('views.admin.blog.flash.successful_creation')
          render json:   Admin::BlogSerializer.new(blog),
                 status: :created
        else
          flash.now[:error] = t('views.admin.blog.flash.error_creation')
          render json:   { errors: blog.errors },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def update
    blog = Admin::Blog.find(params[:id])

    respond_to do |format|
      format.json do
        if blog.update(blog_params)
          flash.now[:success] = t('views.admin.blog.flash.successful_edition')
          render json:   Admin::BlogSerializer.new(blog),
                 status: :ok
        else
          flash.now[:error] = t('views.admin.blog.flash.error_edition')
          render json:   { errors: blog.errors },
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
