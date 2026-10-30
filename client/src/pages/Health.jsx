import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';

export default function Health() {
  const [status, setStatus] = useState('checking');
  const [data, setData] = useState(null);
  const [elapsed, setElapsed] = useState(null);

  const check = useCallback(async () => {
    setStatus('checking');
    setData(null);
    const start = Date.now();
    try {
      const res = await api.get('/health', { timeout: 8000 });
      setElapsed(Date.now() - start);
      setStatus('ok');
      setData(res.data);
    } catch (err) {
      setElapsed(Date.now() - start);
      setStatus('error');
      setData({ error: err.message });
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const dot =
    status === 'ok'
      ? 'bg-signal'
      : status === 'error'
      ? 'bg-red-500'
      : 'bg-yellow-400 animate-pulse';

  const label = status === 'ok' ? 'Online' : status === 'error' ? 'Offline' : 'Checking…';
  const labelColor =
    status === 'ok' ? 'text-signal' : status === 'error' ? 'text-red-400' : 'text-yellow-400';

  return (
    <>
      <Helmet>
        <title>System Health — rOKIt</title>
        <meta name="description" content="System health, API connectivity, and telemetry." />
      </Helmet>

      <div className="font-v4-body text-paper py-20 px-gutter flex items-center justify-center">
        <div className="w-full max-w-lg border border-paper/15 bg-surface p-8 md:p-10">
          <p className="v4-section-label">Diagnostics</p>
          <h1 className="mt-2 font-v4-display text-3xl text-paper mb-6">System Health</h1>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border border-paper/15 p-4 bg-night">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 ${dot}`} />
                <span className="text-paper">API Server</span>
              </div>
              <span className={`font-semibold uppercase tracking-wider ${labelColor}`}>{label}</span>
            </div>

            {elapsed !== null && (
              <div className="flex items-center justify-between border border-paper/15 p-4 bg-night">
                <span className="text-neutral">Latency</span>
                <span className="text-paper">{elapsed} ms</span>
              </div>
            )}

            {data && status === 'ok' && (
              <div className="flex items-center justify-between border border-paper/15 p-4 bg-night">
                <span className="text-neutral">Server Clock</span>
                <span className="text-paper">
                  {data.timestamp ? new Date(data.timestamp).toISOString() : '—'}
                </span>
              </div>
            )}

            {data && status === 'error' && (
              <div className="border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-400 font-mono break-all">
                {data.error}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={check}
            className="v4-action-link mt-8 w-full min-h-12 border border-signal bg-signal text-night font-semibold text-xs uppercase tracking-wider hover:bg-paper transition-colors justify-center"
          >
            Re-check System
          </button>

          <p className="mt-6 text-center text-xs font-mono text-neutral">
            Client App: <span className="text-signal">Online</span>
          </p>
        </div>
      </div>
    </>
  );
}
