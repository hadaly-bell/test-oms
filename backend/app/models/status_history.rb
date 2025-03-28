class StatusHistory < ApplicationRecord
  belongs_to :order
  
  validates :to_status, presence: true
  validates :order, presence: true
  
  after_create :update_order_status
  
  private
  
  def update_order_status
    order.update(status: to_status) unless order.status == to_status
  end
end
