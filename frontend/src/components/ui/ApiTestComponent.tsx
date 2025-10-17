import { useState } from 'react';
import { getJson } from '@/lib/api';

export function ApiTestComponent() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<string>('');

  const testConnection = async () => {
    setStatus('loading');
    setResult('');
    
    try {
      const response = await getJson<{ status: string; message: string; timestamp: string }>('/auth/health');
      setStatus('success');
      setResult(`✅ Connexion réussie: ${response.message} (${response.timestamp})`);
    } catch (error) {
      setStatus('error');
      setResult(`❌ Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <div className="p-4 bg-white/10 rounded-lg backdrop-blur-xl">
      <h3 className="text-lg font-semibold mb-4">🔗 Test de connexion API</h3>
      
      <button
        onClick={testConnection}
        disabled={status === 'loading'}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {status === 'loading' ? 'Test en cours...' : 'Tester la connexion'}
      </button>
      
      {result && (
        <div className={`mt-4 p-3 rounded ${
          status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
        }`}>
          <pre className="text-sm">{result}</pre>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-400">
        <p>🎯 Endpoint testé: <code>GET /api/auth/health</code></p>
        <p>🌐 URL: <code>{import.meta.env.VITE_API_URL}</code></p>
      </div>
    </div>
  );
}