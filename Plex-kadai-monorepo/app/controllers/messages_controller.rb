class MessagesController < ApplicationController
  before_action :authenticate_user!

  def index
    thread = MessageThread.find(params[:thread_id])
    return render json: { error: 'not a participant' }, status: :forbidden unless thread.users.exists?(id: current_user.id)

    messages = thread.messages.order(created_at: :asc)
    render json: messages
  end

  def create
    thread = MessageThread.find(params[:thread_id])
    return render json: { error: 'not a participant' }, status: :forbidden unless thread.users.exists?(id: current_user.id)

    msg = thread.messages.new(message_params.merge(sender_id: current_user.id))
    if msg.save
      render json: msg, status: :created
    else
      render json: { errors: msg.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
  def message_params
    params.require(:message).permit(:body)
  end
end
