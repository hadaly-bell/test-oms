class Api::V1::StatusHistoriesController < ApplicationController
  def create
    @status_history = StatusHistory.new(status_history_params)

    if @status_history.save
      render json: @status_history, status: :created
    else
      render json: { errors: @status_history.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def status_history_params
    params.require(:status_history).permit(:order_id, :from_status, :to_status, :comment, :created_by)
  end
end
