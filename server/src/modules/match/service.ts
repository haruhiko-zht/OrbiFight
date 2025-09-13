import { prisma } from '../../db/prisma';
import { simulate } from '../sim/simulate';
import type { BattleInitServer } from '@orbifight/shared';

export async function simulateMatch(body: any) {
  const timeLimitMs = Number(body?.timeLimitMs ?? 30000);
  const arena = body?.arena ?? { radius: 256 };

  const init: BattleInitServer = {
    seed: (globalThis as any).crypto?.randomUUID?.() ?? `${Date.now()}`,
    timeLimitMs,
    arenaRadius: Number(arena.radius ?? 256),
    teams: [
      {
        members: [
          {
            id: 1,
            pos: { x: 240, y: 270 },
            dir: 0,
            base: { hp: 80, atk: 12, def: 2, ms: 110, range: 20 },
            equip: { moveAI: 'CHASE', targetAI: 'NEAREST', weapon: 'SWORD' },
          },
          {
            id: 2,
            pos: { x: 240, y: 310 },
            dir: 0,
            base: { hp: 60, atk: 9, def: 1, ms: 120, range: 20 },
            equip: { moveAI: 'CHASE', targetAI: 'NEAREST', weapon: 'SWORD' },
          },
        ],
      },
      {
        members: [
          {
            id: 3,
            pos: { x: 720, y: 270 },
            dir: Math.PI,
            base: { hp: 70, atk: 10, def: 1, ms: 110, range: 20 },
            equip: { moveAI: 'CHASE', targetAI: 'NEAREST', weapon: 'SWORD' },
          },
          {
            id: 4,
            pos: { x: 720, y: 230 },
            dir: Math.PI,
            base: { hp: 65, atk: 11, def: 1, ms: 110, range: 20 },
            equip: { moveAI: 'CHASE', targetAI: 'NEAREST', weapon: 'SWORD' },
          },
        ],
      },
    ],
  };

  const replay = simulate(init);

  const saved = await prisma.replay.create({
    data: {
      version: replay.version,
      seed: replay.seed,
      init: replay.init as any,
      result: replay.result,
      duration: replay.duration,
    },
  });

  return { ...replay, id: saved.id };
}
