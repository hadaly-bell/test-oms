class Partner < ApplicationRecord
  PARTNER_TYPES = %w[customer supplier].freeze
  
  has_many :orders, dependent: :destroy
  
  validates :name, presence: true
  validates :email, uniqueness: true, allow_blank: true
  validates :partner_type, presence: true, inclusion: { in: PARTNER_TYPES }
  
  scope :customers, -> { where(partner_type: 'customer') }
  scope :suppliers, -> { where(partner_type: 'supplier') }
end
