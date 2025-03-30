# Test-OMS-Playwright

テスト用注文管理システム（OMS）のPlaywrightテスト実装プロジェクト

## プロジェクト概要

このプロジェクトは、注文管理システム（OMS）のフロントエンドとバックエンドを統合し、Playwrightを使用したエンドツーエンドテストを実装しています。

### 主な機能

- 取引先管理（パートナー）
- 販売管理
- 仕入管理
- ユーザー管理
- 設定・プロフィール管理
- 通知機能

## 技術スタック

### バックエンド
- Ruby on Rails
- PostgreSQL

### フロントエンド
- React
- TypeScript
- Vite

### テスト
- Playwright
- TypeScript

## 環境構築手順

### 前提条件
- Node.js (v16以上)
- npm または yarn
- Ruby (v3.0以上)
- Bundler
- PostgreSQL

### バックエンド環境構築

```bash
# リポジトリのクローン
git clone https://github.com/your-username/test-oms-playwright.git
cd test-oms-playwright/backend

# 依存関係のインストール
bundle install

# データベースの作成と初期データの投入
bundle exec rails db:create db:migrate db:seed

# サーバーの起動
bundle exec rails server -p 3000
```

### フロントエンド環境構築

```bash
# フロントエンドディレクトリに移動
cd ../front

# 依存関係のインストール
npm install
# または
yarn install

# 開発サーバーの起動
npm run dev
# または
yarn dev
```

フロントエンドは http://localhost:5173 でアクセスできます。

### Playwrightテスト環境構築

```bash
# フロントエンドディレクトリで
cd ../front

# Playwrightのインストール
npm install -D @playwright/test
# または
yarn add -D @playwright/test

# ブラウザのインストール
npx playwright install
```

## テストの実行

```bash
# バックエンドとフロントエンドのサーバーが起動していることを確認してから
cd front/tests/playwright
npx playwright test
```

または、提供されているセットアップスクリプトを使用して、バックエンドとフロントエンドのサーバーを自動的に起動し、テストを実行することもできます：

```bash
cd front/tests/playwright
chmod +x setup-servers.sh
./setup-servers.sh
```

## テスト構成

- `front/tests/playwright/specs/`: テスト仕様ファイル
  - `partners.spec.ts`: 取引先管理機能のテスト
  - `sales.spec.ts`: 販売管理機能のテスト
  - `purchases.spec.ts`: 仕入管理機能のテスト
  - `account.spec.ts`: ユーザー管理機能のテスト
  - `settings.spec.ts`: 設定・プロフィール管理機能のテスト
  - `notifications.spec.ts`: 通知機能のテスト

- `front/tests/playwright/utils/`: ユーティリティ関数
  - `test-helpers.ts`: テスト用ヘルパー関数

- `front/tests/playwright/setup.ts`: テストのセットアップファイル

## テスト開発ガイドライン

1. TypeScriptを使用する
2. ロケーターには`getByTestId()`メソッドを使用する
3. すべてのdata-testid属性は`ComponentName_camelCaseDescriptorOfElement`の形式に従う
4. ロケーターは変数に保存してから使用する
5. 複数のテストで再利用されるロジックはヘルパー関数として実装する

## ライセンス

MIT
