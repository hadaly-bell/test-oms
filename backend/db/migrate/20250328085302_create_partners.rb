class CreatePartners < ActiveRecord::Migration[7.1]
  def change
    create_table :partners do |t|
      t.string :name, null: false
      t.string :representative_last_name
      t.string :representative_first_name
      t.string :email
      t.string :phone
      t.text :address
      t.string :partner_type, null: false # renamed from 'type' to avoid conflicts with STI

      t.timestamps
    end
    
    add_index :partners, :email, unique: true
    add_index :partners, :partner_type
  end
end
