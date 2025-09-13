# OrbiFight TODO / Backlog

> 単純な共有 TODO として運用します。小さく早く回すための実務的な一覧です。
>
> 運用ルール（提案）
> - 1行1タスク、先頭に `[ ]` / `[x]` を付与
> - できるだけ「完了判定が明確」な表現にする
> - 担当者を付ける場合は `(@name)` を末尾に添える
> - 大きなタスクは最小単位に分割する
>
> ラベル凡例: `core`(重要) `dx`(開発体験) `infra` `api` `client` `server` `sim` `db`

## Now (次にやる候補: 1〜2週間)
- [ ] `server` に環境変数スキーマを追加（`zod` で `process.env` 検証）【core,server】
- [ ] `server` ルーティングの self-test（Healthcheck/`GET /api/health`）【dx,server】
- [ ] `shared` 型: `Replay`/`SimEvent` の最小テスト（型回帰防止）【dx,shared】
- [ ] `client` のビルドサイズ対策（`manualChunks` or 動的 import）【client,dx】
- [ ] `scripts` に `typecheck` を CI 前提で追加済み → CI 設定で実行【dx,infra】
 - [ ] API 仕様（`docs/api.md`）の継続メンテ（実装変更時に更新）【dx,api】

## Backlog (中期)
- [ ] `server/src/modules/replay` を切り出し（取得API、保存の責務分離）【server,api,db】
- [ ] DB seed スクリプト（デモ用 PartySnapshot）【db,dx】
- [ ] API I/F に zod スキーマ（入出力）を付与【api,server】
- [ ] `paths` エイリアス導入（`@server/*` など）と VSCode 設定【dx】
- [ ] `vite` 開発時プロキシ設定（CORS 回避/同一オリジン化）【client,dx】
 - [ ] リプレイ仕様詳細ドキュメント（イベント語彙・意味の定義）【dx,sim】
 - [ ] セットアップ/トラブルシュートを 1 ページに統合（手順の一元化）【dx】

## Later (検討)
- [ ] シムの決定論強化（rng 実装/パラメタ固定/リプレイ互換性）【sim,core】
- [ ] ロギング基盤（reqId、構造化ログ、サンプリング）【infra,server】
- [ ] 本番 Docker 画像の最小化（`node:18-alpine` or distroless）【infra】
- [ ] エラー整形（エラーレスポンスの共通フォーマット）【api,server】
- [ ] 最低限の E2E（クライアント→API→シム→表示までの通し）【core】

## 完了ログ
- [x] モノレポ構成整理（shared 導入、server レイヤ分割、共通 tsconfig）
- [x] ルートスクリプト（build/typecheck）追加
 - [x] 日本語ドキュメント体制整備（`docs/README.md` 索引/方針）
 - [x] アーキテクチャ文書の日本語化（`docs/architecture.md`）
 - [x] ルート `README.md` の日本語化と導線整備
 - [x] API 仕様 初版作成（`docs/api.md`）
 - [x] `.env.example` / `server/.env.example` のコメント日本語化

## テンプレート（追加時コピペ用）
```
- [ ] <やること> 【<ラベル,カンマ区切り>} (@optional)
```
