class Api::V1::OrdersController < ApplicationController
  before_action :set_order, only: [:show, :update, :destroy]

  def index
    @orders = Order.all
    
    @orders = @orders.where(order_type: params[:type]) if params[:type].present?
    
    @orders = @orders.where(status: params[:status]) if params[:status].present?
    
    render json: @orders.includes(:partner).as_json(include: { partner: { only: [:id, :name, :email] } })
  end

  def show
    render json: @order.as_json(
      include: {
        partner: { except: [:created_at, :updated_at] },
        status_histories: { except: [:updated_at] }
      }
    )
  end

  def create
    @order = Order.new(order_params)

    if @order.save
      render json: @order, status: :created
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @order.update(order_params)
      render json: @order
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @order.destroy
    head :no_content
  end

  private

  def set_order
    @order = Order.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Order not found' }, status: :not_found
  end

  def order_params
    params.require(:order).permit(:partner_id, :order_type, :amount, :status, 
                                 :order_date, :delivery_date, :notes)
  end
end
