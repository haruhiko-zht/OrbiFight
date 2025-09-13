import { useState } from 'react';
import { Replay } from '@orbifight/shared';
import { LoadoutPanel } from './LoadoutPanel';
import '../game/main';

export default function App() {
  const [replay, setReplay] = useState<Replay | null>(null);
  const [loading, setLoading] = useState(false);

  async function runMatch() {
    setLoading(true);
    try {
      // `__API__` is defined in Vite config via `define`
      const res = await fetch(__API__ + '/api/match/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeLimitMs: 30000,
          arena: { radius: 256 },
        }),
      });
      const data = await res.json();
      setReplay(data);
      window.dispatchEvent(new CustomEvent('replay', { detail: data }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>AutoBattle Demo</h2>
        <p>Run → サーバで決定論シム → クライアント再生</p>
        <LoadoutPanel />
        <button onClick={runMatch} disabled={loading}>
          {loading ? 'Simulating…' : 'Run Match'}
        </button>
        {replay && (
          <div style={{ marginTop: 12 }}>
            <div>Result: {replay.result}</div>
            <div>Duration: {Math.round(replay.duration / 1000)}s</div>
          </div>
        )}
      </aside>
      <main className="content">
        <div id="phaser-root"></div>
      </main>
    </div>
  );
}
