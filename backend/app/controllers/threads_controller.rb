class ThreadsController < ApplicationController
  before_action :authenticate_user!

  def index
    threads = MessageThread.joins(:message_thread_participants)
      .where(message_thread_participants: { user_id: current_user.id })
      .includes(:users)
    render json: threads.as_json(include: { users: { only: [:id, :email, :role] } })
  end

  # 企業ユーザーがインターンとのDMを開始
  def create
    unless current_user.company?
      return render json: { error: 'only company can start thread' }, status: :forbidden
    end
    intern_id = params.require(:intern_id)
    thread = MessageThread.find_or_create_between!(current_user.id, intern_id)
    render json: thread, status: :created
  end

  def show
    thread = MessageThread.find(params[:id])
    unless thread.users.exists?(id: current_user.id)
      return render json: { error: 'not a participant' }, status: :forbidden
    end
    render json: thread.as_json(include: { users: { only: [:id, :email, :role] } })
  end
end
