class Order < ApplicationRecord
  ORDER_TYPES = %w[sale purchase].freeze
  STATUSES = %w[draft pending approved completed cancelled].freeze
  
  belongs_to :partner
  has_many :status_histories, dependent: :destroy
  
  validates :order_type, presence: true, inclusion: { in: ORDER_TYPES }
  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :amount, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  
  scope :sales, -> { where(order_type: 'sale') }
  scope :purchases, -> { where(order_type: 'purchase') }
  scope :by_status, ->(status) { where(status: status) if status.present? }
  
  after_create :create_initial_status_history
  after_update :create_status_history_on_status_change, if: :saved_change_to_status?
  
  private
  
  def create_initial_status_history
    status_histories.create(to_status: status, created_by: 'system')
  end
  
  def create_status_history_on_status_change
    status_histories.create(
      from_status: status_before_last_save,
      to_status: status,
      created_by: 'system'
    )
  end
end
