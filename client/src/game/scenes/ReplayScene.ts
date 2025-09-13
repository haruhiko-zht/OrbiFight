import Phaser from 'phaser';
import { Replay, SimEvent } from '@orbifight/shared';

export class ReplayScene extends Phaser.Scene {
  private t = 0;
  private idx = 0;
  private simEvents: SimEvent[] = [];
  private sprites = new Map<number, Phaser.GameObjects.Rectangle>();
  private hp = new Map<number, number>();

  constructor() {
    super('Replay');
  }

  preload() {
    // 画像アセット不要（矩形で表示）
  }

  create() {
    window.addEventListener('replay', (e: any) => this.loadReplay(e.detail as Replay));
    this.add.text(8, 8, 'Replay', { color: '#fff' }).setDepth(10);
  }

  loadReplay(r: Replay) {
    this.cameras.main.setBounds(0, 0, 960, 540);
    this.children.removeAll();
    this.sprites.clear();
    this.hp.clear();
    // アリーナの円（簡易）
    const cx = 480,
      cy = 270,
      rad = r.init.arenaRadius;
    const g = this.add.graphics({ lineStyle: { width: 2, color: 0x888888 } });
    g.strokeCircle(cx, cy, rad);

    // 初期配置（矩形）
    r.init.teams.forEach((team, i) =>
      team.members.forEach(m => {
        const color = i === 0 ? 0x4caf50 : 0x2196f3;
        const s = this.add.rectangle(m.pos.x, m.pos.y, 18, 18, color).setOrigin(0.5, 0.5);
        this.sprites.set(m.id, s);
        this.hp.set(m.id, m.base.hp);
      }),
    );
    this.simEvents = r.events;
    this.t = 0;
    this.idx = 0;
  }

  update(time: number, dt: number) {
    void time;
    this.t += dt;
    while (this.idx < this.simEvents.length && this.simEvents[this.idx].t <= this.t) {
      this.apply(this.simEvents[this.idx++]);
    }
  }

  apply(e: SimEvent) {
    switch (e.kind) {
      case 'move': {
        const s = this.sprites.get(e.a!);
        if (s) s.setPosition(e.v.x, e.v.y);
        break;
      }
      case 'hit': {
        const hp = (this.hp.get(e.b!) ?? 0) - (e.v.dmg ?? 0);
        this.hp.set(e.b!, hp);
        const s = this.sprites.get(e.b!);
        if (s) {
          s.setFillStyle(0xff5555).setAlpha(0.9);
          this.time.delayedCall(80, () => {
            s.setAlpha(1);
          });
        }
        break;
      }
      case 'dead': {
        const s = this.sprites.get(e.a!);
        if (s) s.setAlpha(0.2);
        break;
      }
    }
  }
}
