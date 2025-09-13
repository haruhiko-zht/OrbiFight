export type Vec = { x: number; y: number };
export type SimEvent = { t: number; kind: string; a?: number; b?: number; v?: any };

export type FighterInit = {
  id: number;
  pos: Vec;
  dir: number;
  base: { hp: number; atk: number; def: number; ms: number; range: number };
  equip: { moveAI: string; targetAI: string; weapon: string };
};

// 共通のバトル初期化要素
export type BattleInitBase = {
  timeLimitMs: number;
  arenaRadius: number;
  teams: Array<{ members: FighterInit[] }>;
};

// サーバ側（seed を含む）
export type BattleInitServer = BattleInitBase & { seed: string };

// クライアント/リプレイに含める初期値（seed は含まない）
export type BattleInitClient = BattleInitBase;

export type Replay = {
  version: number;
  seed: string;
  init: BattleInitClient;
  events: SimEvent[];
  result: 'A' | 'B' | 'DRAW';
  duration: number;
};
