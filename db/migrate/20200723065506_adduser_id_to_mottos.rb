class AdduserIdToMottos < ActiveRecord::Migration[5.2]
  def change
    add_reference :mottos, :user, foreign_key: true
  end
end

