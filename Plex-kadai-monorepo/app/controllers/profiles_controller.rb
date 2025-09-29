class ProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: current_user.profile || {}
  end

  def create
    profile = current_user.build_profile(profile_params)
    if profile.save
      render json: profile, status: :created
    else
      render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    profile = current_user.profile || current_user.build_profile
    if profile.update(profile_params)
      render json: profile
    else
      render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
  def profile_params
    params.require(:profile).permit(:name, :school, :bio, :links, skills: [])
  end
end
