class JobPost < ApplicationRecord
  belongs_to :company, class_name: 'User'
  validates :title, :description, presence: true
end
