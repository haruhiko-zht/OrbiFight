# OrbiFight

Fastify + Prisma によるサーバーと、Vite + React + Phaser によるクライアントで構成された軽量デモプロジェクトです。Docker で MySQL と、任意で Nginx リバースプロキシを提供します。

## スタック

- サーバー: Fastify (TypeScript), Prisma, MySQL
- クライアント: Vite, React, Phaser
- インフラ: Docker Compose（MySQL, Nginx）

## 前提条件

- Node.js（推奨バージョンは `.tool-versions` 参照）
- Docker + Docker Compose

## セットアップ

1. 環境変数ファイルを作成

- `cp .env.example .env`
- ルートの `APP_PORT` を確認。`server/.env` に `DATABASE_URL` を設定。

2. インフラ（MySQL）起動

- `docker compose up -d db`

3. 依存関係のインストール（モノレポ直下）と Prisma クライアント生成

- `npm i`（ワークスペース全体）
- `npm run --workspace server prisma:generate`
- スキーマ適用: `npm run --workspace server db:push`（または `db:migrate`）

4. 起動（単体 or 並列）

- サーバーのみ: `npm run --workspace server dev`
- クライアントのみ: `npm run --workspace client dev`
- 両方同時: `npm run dev`（concurrently で並列起動）
- サーバーは `http://localhost:${PORT}` で待ち受け（`server/.env.example` 参照。既定は 40103）。Nginx を使う場合はルートの `APP_PORT` と一致させてください。

5. クライアント起動

- 上の並列起動を使わない場合のみ: `npm run --workspace client dev`

## 任意: Nginx でビルド済みクライアントを配信

ローカルで静的配信を試す場合:

1. クライアントをビルド

- `npm run --workspace client build`

2. Nginx プロファイル起動（`client/dist` を配信し、`/api` をアプリへプロキシ）

- `docker compose --profile nginx up -d nginx`

3. アクセス

- `http://localhost:${NGINX_HTTP_PORT}`（既定は 40108）

メモ

- アプリサーバーのポートが `APP_PORT`（Nginx プロキシ）および `PORT`（`server/.env`）と一致していることを確認。
- Nginx 設定は `/assets/*` を長期キャッシュし、SPA ルーティングのために `/index.html` へフォールバックします。
- Vite の開発サーバーは `http://localhost:5173` で動作します。

クライアントは `client/vite.config.ts` で定義される `__API__` を用いてサーバーへアクセスします。変更したい場合はシェルで `VITE_API_BASE` を設定してください。

## 開発メモ

- Prisma スキーマ: `server/prisma/schema.prisma`
- モデル追加・変更後は `npm run prisma:generate` を再実行し、`db:push` または `db:migrate` で適用。
- `.gitignore` は Node/ビルド生成物/ログ/Prisma 生成物に対応するよう拡張済み。
- コード整形: ルートに Prettier を設定済み。
  - 書き込み整形: `npm run format`
  - 検証のみ: `npm run format:check`

### モノレポ共通スクリプト（ルート `package.json`）

- `dev`: サーバーとクライアントを並列起動
- `dev:server` / `dev:client`: それぞれ個別起動
- `build`: サーバー→クライアントの順にビルド
- `build:server` / `build:client`: 個別ビルド
- `typecheck`: サーバー/クライアントの型チェック（`--noEmit`）

## ドキュメント（日本語）

- ドキュメントの方針と索引は `docs/README.md` を参照してください。
- API 詳細は `docs/api.md` へ。

## Docker サービス

- MySQL: `127.0.0.1:${MYSQLD_PORT}` で公開（既定 40106）
  - Redis は未使用
- Nginx: `APP_PORT` へサーバーをプロキシ。単一フロントドアが欲しいときに便利。

## よく使うスクリプト（`server/package.json`）

- `dev`: Fastify をウォッチモードで起動
- `build`: TypeScript を `dist` へビルド
- `start`: ビルド済みサーバーを起動
- `db:push`: マイグレーションを作らずに DB へスキーマ適用
- `db:migrate`: 開発マイグレーションを作成/適用（既定名 `init`）
- `prisma:generate`: Prisma クライアント生成
- `prisma:studio`: Prisma Studio を開く

## トラブルシューティング

- Prisma のクライアント不足エラー: `server` で `npm run prisma:generate` を実行。
- DB 接続失敗: `docker compose up -d` を確認し、`server/.env` の `DATABASE_URL` が公開ポートと一致しているか確認。
- クライアントが API に到達できない: `VITE_API_BASE` を確認、または `client/vite.config.ts` を更新。
