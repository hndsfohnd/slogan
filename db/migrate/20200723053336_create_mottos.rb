class CreateMottos < ActiveRecord::Migration[5.2]
  def change
    create_table :mottos do |t|
      t.string :jos
      t.text :body
      t.integer :year

      t.timestamps
    end
  end
end
