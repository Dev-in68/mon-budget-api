// Test simple pour vérifier la configuration API
import React from 'react';
import { getJson } from '@/lib/api';

export function TestApiConnection() {
  const testConnection = async () => {
    try {
      console.log('Testing API connection...');
      const result = await getJson('/auth/health');
      console.log('API Response:', result);
      alert('✅ API Connected: ' + JSON.stringify(result));
    } catch (error) {
      console.error('API Error:', error);
      alert('❌ API Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Test automatique au montage
  React.useEffect(() => {
    testConnection();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      padding: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white',
      zIndex: 9999 
    }}>
      <button onClick={testConnection}>
        Test API Manual
      </button>
    </div>
  );
}