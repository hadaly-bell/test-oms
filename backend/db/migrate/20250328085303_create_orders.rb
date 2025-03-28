class CreateOrders < ActiveRecord::Migration[7.1]
  def change
    create_table :orders do |t|
      t.references :partner, null: false, foreign_key: true
      t.string :order_type, null: false # renamed from 'type' to avoid conflicts with STI
      t.decimal :amount, precision: 10, scale: 2
      t.string :status, null: false, default: 'draft'
      t.date :order_date
      t.date :delivery_date
      t.text :notes

      t.timestamps
    end
    
    add_index :orders, :order_type
    add_index :orders, :status
  end
end
