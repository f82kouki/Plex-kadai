class InternsController < ApplicationController
  before_action :authenticate_user!

  def index
    interns = User.intern.includes(:profile)
    render json: interns.as_json(include: :profile)
  end

  def show
    intern = User.intern.includes(:profile).find(params[:id])
    render json: intern.as_json(include: :profile)
  end
end
