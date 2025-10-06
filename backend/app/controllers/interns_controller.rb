class InternsController < ApplicationController
  before_action :authenticate_user!, except: [:index]
  before_action :set_intern, only: [:show, :destroy]

  def index
    interns = User.intern.includes(:profile)
    
    # 検索パラメータがある場合のフィルタリング
    if params[:search].present?
      search_term = params[:search].downcase
      interns = interns.joins(:profile).where(
        "LOWER(profiles.name) LIKE ? OR LOWER(profiles.school) LIKE ? OR LOWER(users.email) LIKE ?",
        "%#{search_term}%", "%#{search_term}%", "%#{search_term}%"
      )
    end
    
    # スキルでの検索
    if params[:skills].present?
      skills = params[:skills].split(',').map(&:strip)
      interns = interns.joins(:profile).where(
        "profiles.skills ?| array[?]",
        skills
      )
    end
    
    # 学校での検索
    if params[:school].present?
      school_term = params[:school].downcase
      interns = interns.joins(:profile).where(
        "LOWER(profiles.school) LIKE ?",
        "%#{school_term}%"
      )
    end
    
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
