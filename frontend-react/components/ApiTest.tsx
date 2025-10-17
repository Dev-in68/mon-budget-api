import React, { useState, useEffect } from 'react';

export function ApiTestComponent() {
  const [health, setHealth] = useState<string>('Testing...');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testApi = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const response = await fetch(`${apiUrl}/auth/health`);
        if (response.ok) {
          const data = await response.json();
          setHealth(`✅ API Connected: ${data.message || 'Health check passed'}`);
        } else {
          setError(`❌ API Error: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        setError(`❌ Connection Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    testApi();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      padding: '10px',
      backgroundColor: error ? '#ffebee' : '#e8f5e8',
      border: '1px solid',
      borderColor: error ? '#f44336' : '#4caf50',
      borderRadius: '4px',
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <div>{health}</div>
      {error && <div style={{ color: '#f44336' }}>{error}</div>}
    </div>
  );
}