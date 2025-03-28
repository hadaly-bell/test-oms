class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :last_name
      t.string :first_name
      t.string :role, default: 'user'
      t.string :avatar_url

      t.timestamps
    end
    
    add_index :users, :email, unique: true
    add_index :users, :role
  end
end
