# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  enum :role, { intern: 0, company: 1 }, default: :intern

  has_one  :profile, dependent: :destroy
  has_many :messages,   foreign_key: :sender_id,  dependent: :destroy
  has_many :job_posts,  foreign_key: :company_id, dependent: :destroy
end
