class MessageThread < ApplicationRecord
  has_many :message_thread_participants, dependent: :destroy
  has_many :users, through: :message_thread_participants
  has_many :messages, dependent: :destroy
  
  
  def self.find_or_create_between!(user_a_id, user_b_id)
    ids = [user_a_id, user_b_id].sort
    thread = joins(:message_thread_participants)
    .group('message_threads.id')
    .having('COUNT(*) = 2')
    .where(message_thread_participants: { user_id: ids })
    .first
   return thread if thread
  
  
   create!.tap do |t|
     ids.each { |uid| t.message_thread_participants.create!(user_id: uid) }
   end
  end
end