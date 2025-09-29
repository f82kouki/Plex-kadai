class Message < ApplicationRecord
  belongs_to :message_thread
  belongs_to :sender, class_name: 'User'
  validates :body, presence: true
end