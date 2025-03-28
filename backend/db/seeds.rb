# Create sample partners
partners = [
  { name: '株式会社山田商事', representative_last_name: '山田', representative_first_name: '太郎', email: 'yamada@example.com', phone: '03-1234-5678', address: '東京都渋谷区1-1-1', partner_type: 'customer' },
  { name: '田中物産株式会社', representative_last_name: '田中', representative_first_name: '花子', email: 'tanaka@example.com', phone: '06-8765-4321', address: '大阪府大阪市中央区2-2-2', partner_type: 'supplier' }
]

partners.each do |partner_data|
  Partner.create!(partner_data)
end

# Create sample users
users = [
  { email: 'admin@example.com', last_name: '管理', first_name: '太郎', role: 'admin' },
  { email: 'user@example.com', last_name: '一般', first_name: '次郎', role: 'user' }
]

users.each do |user_data|
  User.create!(user_data)
end

# Create sample orders
orders = [
  { partner: Partner.find_by(partner_type: 'customer'), order_type: 'sale', amount: 50000, status: 'pending', order_date: Date.today, delivery_date: Date.today + 7.days, notes: '特急対応' },
  { partner: Partner.find_by(partner_type: 'supplier'), order_type: 'purchase', amount: 30000, status: 'approved', order_date: Date.today - 3.days, delivery_date: Date.today + 10.days, notes: '定期発注' }
]

orders.each do |order_data|
  Order.create!(order_data)
end
