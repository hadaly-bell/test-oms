class User < ApplicationRecord
  ROLES = %w[admin user].freeze
  
  validates :email, presence: true, uniqueness: true
  validates :role, inclusion: { in: ROLES }
  
  def full_name
    "#{first_name} #{last_name}".strip
  end
end
