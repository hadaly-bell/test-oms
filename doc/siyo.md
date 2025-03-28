# 注文管理システム 仕様書

## 1. システム概要

本システムは、企業の注文管理を効率化するためのWebアプリケーションです。取引先（顧客・サプライヤー）との取引を一元管理し、注文のステータス追跡、履歴管理を行います。

## 2. 技術スタック

### フロントエンド
- React
- TypeScript
- Bolt.new

### バックエンド
- Ruby on Rails 7.1.5
- SQLite3（開発環境）
- RESTful API

## 3. データモデル

### Partner（取引先）
| フィールド | 型 | 説明 |
|------------|------|-------------|
| id | integer | 主キー |
| name | string | 会社名 |
| representative_last_name | string | 担当者姓 |
| representative_first_name | string | 担当者名 |
| email | string | メールアドレス |
| phone | string | 電話番号 |
| address | text | 住所 |
| type | string | 取引先タイプ（customer/supplier） |

### Order（注文）
| フィールド | 型 | 説明 |
|------------|------|-------------|
| id | integer | 主キー |
| partner_id | integer | 取引先ID（外部キー） |
| type | string | 注文タイプ（sale/purchase） |
| amount | decimal | 金額 |
| status | string | ステータス（draft/pending/approved/completed/cancelled） |
| order_date | date | 注文日 |
| delivery_date | date | 納品予定日 |
| notes | text | 備考 |

### StatusHistory（ステータス履歴）
| フィールド | 型 | 説明 |
|------------|------|-------------|
| id | integer | 主キー |
| order_id | integer | 注文ID（外部キー） |
| from_status | string | 変更前ステータス |
| to_status | string | 変更後ステータス |
| comment | text | コメント |
| created_by | string | 作成者 |

### User（ユーザー）
| フィールド | 型 | 説明 |
|------------|------|-------------|
| id | integer | 主キー |
| email | string | メールアドレス |
| last_name | string | 姓 |
| first_name | string | 名 |
| role | string | 役割（admin/user） |
| avatar_url | string | アバター画像URL |

## 4. API仕様

### Partners API

#### 取引先一覧取得
- エンドポイント: GET /api/v1/partners
- レスポンス: 取引先の一覧（JSON配列）

#### 取引先詳細取得
- エンドポイント: GET /api/v1/partners/:id
- レスポンス: 指定されたIDの取引先詳細（JSON）

#### 取引先作成
- エンドポイント: POST /api/v1/partners
- リクエストボディ: 取引先情報（JSON）
- レスポンス: 作成された取引先情報（JSON）

#### 取引先更新
- エンドポイント: PUT /api/v1/partners/:id
- リクエストボディ: 更新する取引先情報（JSON）
- レスポンス: 更新された取引先情報（JSON）

#### 取引先削除
- エンドポイント: DELETE /api/v1/partners/:id
- レスポンス: 204 No Content

### Orders API

#### 注文一覧取得
- エンドポイント: GET /api/v1/orders
- クエリパラメータ:
  - type: 注文タイプでフィルタリング（オプション）
  - status: ステータスでフィルタリング（オプション）
- レスポンス: 注文の一覧（JSON配列）、各注文には関連する取引先の基本情報も含まれる

#### 注文詳細取得
- エンドポイント: GET /api/v1/orders/:id
- レスポンス: 指定されたIDの注文詳細（JSON）、関連する取引先情報とステータス履歴も含まれる

#### 注文作成
- エンドポイント: POST /api/v1/orders
- リクエストボディ: 注文情報（JSON）
- レスポンス: 作成された注文情報（JSON）
- 備考: 注文作成時に初期ステータス履歴も自動的に作成される

#### 注文更新
- エンドポイント: PUT /api/v1/orders/:id
- リクエストボディ: 更新する注文情報（JSON）
- レスポンス: 更新された注文情報（JSON）
- 備考: ステータスが変更された場合、ステータス履歴も自動的に作成される

#### 注文削除
- エンドポイント: DELETE /api/v1/orders/:id
- レスポンス: 204 No Content

### StatusHistories API

#### ステータス履歴作成
- エンドポイント: POST /api/v1/status_histories
- リクエストボディ: ステータス履歴情報（JSON）
- レスポンス: 作成されたステータス履歴情報（JSON）
- 備考: ステータス履歴作成時に関連する注文のステータスも自動的に更新される

### Users API

#### ユーザー一覧取得
- エンドポイント: GET /api/v1/users
- レスポンス: ユーザーの一覧（JSON配列）

#### ユーザー詳細取得
- エンドポイント: GET /api/v1/users/:id
- レスポンス: 指定されたIDのユーザー詳細（JSON）

#### ユーザー作成
- エンドポイント: POST /api/v1/users
- リクエストボディ: ユーザー情報（JSON）
- レスポンス: 作成されたユーザー情報（JSON）

#### ユーザー更新
- エンドポイント: PUT /api/v1/users/:id
- リクエストボディ: 更新するユーザー情報（JSON）
- レスポンス: 更新されたユーザー情報（JSON）

## 5. セキュリティ

- CORS設定により、フロントエンドからのAPIアクセスを許可
- 本番環境では適切な認証・認可の実装が必要

## 6. 将来の拡張性

- 認証機能の追加（JWT、Devise等）
- 通知機能の実装
- レポート・分析機能の追加
- 多言語対応