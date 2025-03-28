# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_03_28_085305) do
  create_table "orders", force: :cascade do |t|
    t.integer "partner_id", null: false
    t.string "order_type", null: false
    t.decimal "amount", precision: 10, scale: 2
    t.string "status", default: "draft", null: false
    t.date "order_date"
    t.date "delivery_date"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_type"], name: "index_orders_on_order_type"
    t.index ["partner_id"], name: "index_orders_on_partner_id"
    t.index ["status"], name: "index_orders_on_status"
  end

  create_table "partners", force: :cascade do |t|
    t.string "name", null: false
    t.string "representative_last_name"
    t.string "representative_first_name"
    t.string "email"
    t.string "phone"
    t.text "address"
    t.string "partner_type", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_partners_on_email", unique: true
    t.index ["partner_type"], name: "index_partners_on_partner_type"
  end

  create_table "status_histories", force: :cascade do |t|
    t.integer "order_id", null: false
    t.string "from_status"
    t.string "to_status", null: false
    t.text "comment"
    t.string "created_by"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_status_histories_on_order_id"
    t.index ["to_status"], name: "index_status_histories_on_to_status"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "last_name"
    t.string "first_name"
    t.string "role", default: "user"
    t.string "avatar_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  add_foreign_key "orders", "partners"
  add_foreign_key "status_histories", "orders"
end
