Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :partners
      resources :orders
      resources :status_histories, only: [:create]
      resources :users, except: [:destroy]
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
