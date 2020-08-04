class MottosController < ApplicationController
  protect_from_forgery
  def index 
    @mottos = Motto.page(params[:page]).per(10).all.order(id: "DESC")
  end

  def create  
    @motto = Motto.new(slogan_params)
    @motto.save
    @mottos = Motto.all.order(id: "DESC") 
    render :create
  end
  
  def search
    @search = Motto.ransack(params[:q])
    @mottos = @search.result(distinct: true).page(params[:page]).per(10).all.order(id: "DESC")
  end


  def result
    if params[:q].present? 
      params[:q][:body_cont_all] = params[:q][:body_cont_all].split(/[\p{blank}\s]+/) 
      @search = Motto.ransack(params[:q])
      @mottos = @search.result
      respond_to do |format|
        format.json { render json: @mottos }
        format.html
      end
    elsif params[:q].present? && params[:q][:body_cont_all].present? && params[:q][:year_eq].present?
      @search = Motto.ransack(params[:q])
      @mottos = @search.result #検索の結果を受け取る。
      respond_to do |format|
        format.html
        format.json { render json: @mottos}
      end
    end
  end

  def update
    @motto = Motto.find(params[:id])
    @motto[:body] = params[:q][:body]
    @motto.update(slogan_update_params)
  end

  def destroy
    @motto = Motto.find(params[:id])
    @motto.delete
  end

  private 
    def slogan_params
      params.permit(:jos, :body, :year).merge(user_id: current_user.id)
    end

    def search_params
      params[:q]['body_cont_all'].split(/[\p{blank}\s]+/)
    end

    def slogan_update_params
      params.permit(:body)
    end

end
