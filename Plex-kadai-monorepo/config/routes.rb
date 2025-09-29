Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json }

  scope :api, defaults: { format: :json } do
    resource :profile, only: [:show, :create, :update]
    resources :interns, only: [:index, :show]
    resources :threads, only: [:index, :create, :show] do
      resources :messages, only: [:index, :create]
    end
    resources :job_posts, only: [:index, :create, :show]
  end
end
