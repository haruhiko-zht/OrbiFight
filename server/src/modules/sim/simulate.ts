import { BattleInitServer as BattleInit, Replay, SimEvent } from '@orbifight/shared';

function rngFromSeed(seed: string) {
  // 超簡易（実運用は seedrandom など推奨）
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => (h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0;
}

export function simulate(init: BattleInit): Replay {
  const tick = 16; // 60fps相当
  const rand = rngFromSeed(init.seed); // eslint-disable-line @typescript-eslint/no-unused-vars

  // デモ用：2v2を左右から接近させて殴り合うだけの簡易シム
  const A = init.teams[0].members.map(m => ({ ...m }));
  const B = init.teams[1].members.map(m => ({ ...m }));
  const all = [...A, ...B];
  const hp = new Map<number, number>();
  const pos = new Map<number, { x: number; y: number }>();
  all.forEach(m => {
    hp.set(m.id, m.base.hp);
    pos.set(m.id, { ...m.pos });
  });

  const events: SimEvent[] = [];
  let t = 0,
    left = init.timeLimitMs;

  const step = () => {
    // 1) 単純移動：互いに向かって直線移動（壁は未実装）
    for (const m of all) {
      const enemies = (A.includes(m) ? B : A).filter(e => hp.get(e.id)! > 0);
      if (!enemies.length) continue;
      // ターゲットは最も近い
      let target = enemies[0]!;
      let best = 1e9;
      const p = pos.get(m.id)!;
      for (const e of enemies) {
        const q = pos.get(e.id)!;
        const dx = q.x - p.x,
          dy = q.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < best) {
          best = d2;
          target = e;
        }
      }
      const q = pos.get(target.id)!;
      const dx = q.x - p.x,
        dy = q.y - p.y;
      const len = Math.hypot(dx, dy) || 1;
      const spd = m.base.ms * (tick / 1000);
      const nx = p.x + (dx / len) * spd;
      const ny = p.y + (dy / len) * spd;
      p.x = nx;
      p.y = ny;
      events.push({ t, kind: 'move', a: m.id, v: { x: nx, y: ny } });

      // 近接判定（range以内）
      if (Math.hypot(q.x - p.x, q.y - p.y) <= m.base.range) {
        const dmg = Math.max(1, m.base.atk - target.base.def);
        const cur = hp.get(target.id)! - dmg;
        hp.set(target.id, cur);
        events.push({ t, kind: 'hit', a: m.id, b: target.id, v: { dmg } });
        if (cur <= 0) events.push({ t, kind: 'dead', a: target.id });
      }
    }
  };

  while (left > 0) {
    // 勝敗チェック
    const aliveA = A.some(m => hp.get(m.id)! > 0);
    const aliveB = B.some(m => hp.get(m.id)! > 0);
    if (!aliveA || !aliveB) break;
    step();
    t += tick;
    left -= tick;
  }

  let result: 'A' | 'B' | 'DRAW' = 'DRAW';
  const sumA = A.reduce((s, m) => s + Math.max(0, hp.get(m.id)!), 0);
  const sumB = B.reduce((s, m) => s + Math.max(0, hp.get(m.id)!), 0);
  if (A.some(m => hp.get(m.id)! > 0) && !B.some(m => hp.get(m.id)! > 0)) result = 'A';
  else if (B.some(m => hp.get(m.id)! > 0) && !A.some(m => hp.get(m.id)! > 0)) result = 'B';
  else if (sumA !== sumB) result = sumA > sumB ? 'A' : 'B';

  return {
    version: 1,
    seed: init.seed,
    init: { timeLimitMs: init.timeLimitMs, arenaRadius: init.arenaRadius, teams: init.teams },
    events,
    result,
    duration: t,
  };
}
