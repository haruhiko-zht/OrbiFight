# API 仕様（日本語）

現在提供しているエンドポイントは最小限です。試合シミュレーションのみ。

## ベース
- ベース URL: `http://localhost:${PORT}`（既定 `40103`）
- 全てのパスはアプリ側で `/api` プレフィックスを付与しています。

## シミュレーション実行
- メソッド: `POST`
- パス: `/api/match/simulate`
- リクエストボディ: 任意（未指定の場合はデモ用デフォルトで実行）
  - `timeLimitMs`: 数値（試合の制限時間ミリ秒）例: `30000`
  - `arena.radius`: 数値（円形アリーナ半径）例: `256`
  - 将来的に編成などを受け付け予定（現状はサーバー側でデモ2v2を生成）

- レスポンス: `Replay` 形式の JSON（DB に保存された `id` を付与）
  - `version`: 数値（リプレイフォーマットのバージョン）
  - `seed`: 乱数シード（サーバー生成）
  - `init`: 初期化情報（`timeLimitMs`, `arenaRadius`, `teams`）
  - `events`: シミュレーションイベント配列（`move`, `hit`, `dead` など）
  - `result`: `'A' | 'B' | 'DRAW'`
  - `duration`: 実行時間（ミリ秒）
  - `id`: 保存されたリプレイ ID（数値）

### 例
リクエスト:
```json
{
  "timeLimitMs": 30000,
  "arena": { "radius": 256 }
}
```
レスポンス（抜粋）:
```json
{
  "version": 1,
  "seed": "...",
  "init": { "timeLimitMs": 30000, "arenaRadius": 256, "teams": [/*...*/] },
  "events": [ { "t": 0, "kind": "move", "a": 1, "v": {"x": 241, "y": 270} } ],
  "result": "A",
  "duration": 12480,
  "id": 12
}
```

## 型（抜粋）
`@orbifight/shared` でクライアント/サーバー共通の型を提供します。
- `Replay`: リプレイ本体
- `SimEvent`: 時系列イベント（`t`, `kind`, `a/b`, `v`）
- `BattleInit*`: 初期化データ（`Server` は `seed` を含む）

> 補足: ヘルスチェックは未実装です（`GET /api/health` は TODO）。進捗は `docs/todo.md` を参照してください。
