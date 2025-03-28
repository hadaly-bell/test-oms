class CreateStatusHistories < ActiveRecord::Migration[7.1]
  def change
    create_table :status_histories do |t|
      t.references :order, null: false, foreign_key: true
      t.string :from_status
      t.string :to_status, null: false
      t.text :comment
      t.string :created_by

      t.timestamps
    end
    
    add_index :status_histories, :to_status
  end
end
