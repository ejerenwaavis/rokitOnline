import { useEffect, useState, useCallback } from 'react';
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

  useEffect(() => { check(); }, [check]);

  const dot = status === 'ok' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-yellow-400 animate-pulse';
  const label = status === 'ok' ? 'Online' : status === 'error' ? 'Offline' : 'Checking…';
  const labelColor = status === 'ok' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-yellow-500';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-xl font-black text-rokit-dark mb-6">System Health</h1>

        <div className="space-y-4">
          <div className="flex items-center justify-between border border-gray-100 rounded p-4">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${dot}`} />
              <span className="font-semibold text-sm text-rokit-dark">API Server</span>
            </div>
            <span className={`text-sm font-bold ${labelColor}`}>{label}</span>
          </div>

          {elapsed !== null && (
            <div className="flex items-center justify-between border border-gray-100 rounded p-4">
              <span className="text-sm text-rokit-body">Response time</span>
              <span className="text-sm font-semibold text-rokit-dark">{elapsed}ms</span>
            </div>
          )}

          {data && status === 'ok' && (
            <div className="flex items-center justify-between border border-gray-100 rounded p-4">
              <span className="text-sm text-rokit-body">Server time</span>
              <span className="text-sm font-semibold text-rokit-dark">
                {data.timestamp ? new Date(data.timestamp).toLocaleString() : '—'}
              </span>
            </div>
          )}

          {data && status === 'error' && (
            <div className="border border-red-100 bg-red-50 rounded p-4 text-xs text-red-600 font-mono break-all">
              {data.error}
            </div>
          )}
        </div>

        <button
          onClick={check}
          className="mt-6 w-full bg-rokit-orange text-white py-2 text-sm font-semibold hover:bg-rokit-orange-dark transition-colors"
        >
          Re-check
        </button>

        <p className="mt-4 text-center text-xs text-gray-400">
          Frontend: <span className="font-semibold text-green-600">✓ Online</span>
        </p>
      </div>
    </div>
  );
}
