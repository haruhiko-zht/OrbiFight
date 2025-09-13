# OrbiFight アーキテクチャ

## モノレポ構成

- `client`: React + Vite + Phaser によるクライアント UI
- `server`: Fastify + Prisma による API（`app`/`routes`/`modules` レイヤ）
- `shared`: クライアント/サーバで共通利用する型・ユーティリティ
- `infra`: Docker、DB、Nginx などのインフラ設定
- `scripts`: ローカル開発や CI 用の補助スクリプト

## API 構成

- ベースプレフィックス: `/api`
- 試合シミュレーション: `POST /api/match/simulate`

## 共有型（`@orbifight/shared`）

`@orbifight/shared` は `Replay` や `SimEvent`、`BattleInit*` 系などのドメイン型を提供し、
クライアントとサーバ間の齟齬（型のドリフト）を防ぎます。

## 次のアクション

運用中の TODO は `docs/todo.md` を参照してください。
