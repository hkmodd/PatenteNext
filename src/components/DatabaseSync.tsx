import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, CheckCircle2, Download, CloudCog } from 'lucide-react';
import { Button } from './ui/Button';
import { syncDatabase, getDatabaseMeta } from '../lib/db';

// Simulated Remote CDN URL for the database
const REMOTE_DB_URL = 'https://raw.githubusercontent.com/ministero-trasporti/patente-db/main/database.json';
const FALLBACK_LOCAL_DB = '/database.json';

export function DatabaseSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [meta, setMeta] = useState<{ lastSync?: number; totalQuestions?: number; version?: string }>({});
  const [syncStatus, setSyncStatus] = useState<'idle' | 'checking' | 'syncing' | 'success' | 'error'>('idle');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('checking');
    try {
      // Simulate checking remote CDN for updates
      await new Promise(resolve => setTimeout(resolve, 800));
      setSyncStatus('syncing');
      
      let data;
      try {
        // Attempt to fetch from remote CDN (simulated)
        // In a real scenario, this would fetch the latest version
        // const response = await fetch(REMOTE_DB_URL);
        // data = await response.json();
        throw new Error('Simulated remote fetch failure, falling back to local');
      } catch (e) {
        // Fallback to local bundled database
        const response = await fetch(FALLBACK_LOCAL_DB);
        if (!response.ok) throw new Error('Failed to fetch local database');
        data = await response.json();
      }
      
      // Basic validation
      if (!Array.isArray(data) || data.length === 0 || !data[0].id) {
        throw new Error('Invalid database format');
      }

      await syncDatabase(data);
      const m = await getDatabaseMeta();
      // Add a simulated version based on the current year
      setMeta({ ...m, version: `v${new Date().getFullYear()}.1` });
      setSyncStatus('success');
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      alert('Errore durante la sincronizzazione del database.');
    } finally {
      setIsSyncing(false);
    }
  };

  const loadMeta = async () => {
    const m = await getDatabaseMeta();
    setMeta({ ...m, version: m.totalQuestions ? `v${new Date().getFullYear()}.1` : undefined });
    
    // Auto-sync on first load if no questions are present
    if (!m.totalQuestions) {
      handleSync();
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  return (
    <div className="flex items-center justify-between p-4 bg-surface border border-surface-border rounded-xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent/10 rounded-lg text-accent relative">
          {syncStatus === 'checking' || syncStatus === 'syncing' ? (
            <CloudCog className="w-5 h-5 animate-pulse" />
          ) : (
            <Database className="w-5 h-5" />
          )}
          {meta.totalQuestions && syncStatus !== 'syncing' && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-success rounded-full border-2 border-surface"></div>
          )}
        </div>
        <div>
          <h3 className="font-display font-bold text-sm flex items-center gap-2">
            Database Ministeriale 
            {meta.version && (
              <span className="px-1.5 py-0.5 bg-accent/20 text-accent rounded text-[10px] font-mono">
                {meta.version}
              </span>
            )}
          </h3>
          <p className="text-xs text-secondary font-mono flex items-center gap-1">
            {syncStatus === 'checking' ? 'Verifica aggiornamenti...' :
             syncStatus === 'syncing' ? 'Download in corso...' :
             meta.totalQuestions ? `${meta.totalQuestions} quiz (Sincronizzato)` : 
             'Non sincronizzato'}
          </p>
        </div>
      </div>
      <Button 
        variant={meta.totalQuestions ? "outline" : "default"} 
        size="sm" 
        onClick={handleSync}
        disabled={isSyncing}
        className="gap-2"
      >
        {isSyncing ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : syncStatus === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-success" />
        ) : meta.totalQuestions ? (
          <RefreshCw className="w-4 h-4" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {isSyncing ? 'Sinc...' : syncStatus === 'success' ? 'Aggiornato' : meta.totalQuestions ? 'Verifica' : 'Scarica'}
        </span>
      </Button>
    </div>
  );
}
