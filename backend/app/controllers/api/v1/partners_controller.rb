class Api::V1::PartnersController < ApplicationController
  before_action :set_partner, only: [:show, :update, :destroy]

  def index
    @partners = Partner.all
    render json: @partners
  end

  def show
    render json: @partner
  end

  def create
    @partner = Partner.new(partner_params)

    if @partner.save
      render json: @partner, status: :created
    else
      render json: { errors: @partner.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @partner.update(partner_params)
      render json: @partner
    else
      render json: { errors: @partner.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @partner.destroy
    head :no_content
  end

  private

  def set_partner
    @partner = Partner.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Partner not found' }, status: :not_found
  end

  def partner_params
    params.require(:partner).permit(:name, :representative_last_name, :representative_first_name, 
                                   :email, :phone, :address, :partner_type)
  end
end
