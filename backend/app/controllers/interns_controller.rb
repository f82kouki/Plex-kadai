class InternsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_intern, only: [:show, :destroy]

  def index
    interns = User.intern.includes(:profile)
    render json: interns.as_json(include: :profile)
  end

  def show
    render json: @intern.as_json(include: :profile)
  end

  # 企業ユーザーのみがインターンを削除できる、もしくは本人による退会
  def destroy
    unless current_user.company? || current_user.id == @intern.id
      return render json: { error: 'forbidden' }, status: :forbidden
    end
    @intern.destroy!
    head :no_content
  end

  private
  def set_intern
    @intern = User.intern.find(params[:id])
  end
end
