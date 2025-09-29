class JobPostsController < ApplicationController
  before_action :authenticate_user!

  def index
    posts = JobPost.includes(:company).order(created_at: :desc)
    render json: posts.as_json(include: { company: { only: [:id, :email] } })
  end

  def show
    post = JobPost.find(params[:id])
    render json: post.as_json(include: { company: { only: [:id, :email] } })
  end

  def create
    unless current_user.company?
      return render json: { error: 'only company can create job posts' }, status: :forbidden
    end

    post = current_user.job_posts.new(job_post_params)
    if post.save
      render json: post, status: :created
    else
      render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
  def job_post_params
    params.require(:job_post).permit(:title, :description, :tags)
  end
end
