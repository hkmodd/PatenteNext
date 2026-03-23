import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, CheckCircle2, Download, CloudCog, WifiOff } from 'lucide-react';
import { Button } from './ui/Button';
import { syncDatabase, getDatabaseMeta } from '../lib/db';
import { quantumDB } from '../lib/QuantumDB';
import { useAppStore } from '../store/useAppStore';

// Simulated Remote CDN URL for the database
const REMOTE_DB_URL = 'https://raw.githubusercontent.com/ministero-trasporti/patente-db/main/database.json';
const FALLBACK_LOCAL_DB = `${import.meta.env.BASE_URL}database.json`;

export function DatabaseSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [meta, setMeta] = useState<{ lastSync?: number; totalQuestions?: number; version?: string }>({});
  const [syncStatus, setSyncStatus] = useState<'idle' | 'checking' | 'syncing' | 'success' | 'error'>('idle');
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const setTheoryManifest = useAppStore((state) => state.setTheoryManifest);

  // Online/Offline detection
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    setSyncStatus('checking');
    try {
      // Simulate checking remote CDN for updates
      await new Promise(resolve => setTimeout(resolve, 800));
      setSyncStatus('syncing');
      
      let data;
      try {
        // Attempt to fetch from remote CDN
        const response = await fetch(REMOTE_DB_URL);
        if (!response.ok) throw new Error(`Remote fetch failed: ${response.status}`);
        data = await response.json();
      } catch (e) {
        // Fallback to local bundled database
        const response = await fetch(`${FALLBACK_LOCAL_DB}?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch local database');
        data = await response.json();
      }
      
      // Basic validation
      if (!Array.isArray(data) || data.length === 0 || !data[0].id) {
        throw new Error('Invalid database format');
      }

      await syncDatabase(data);
      
      // Fetch Theory Manifest via QuantumDB
      try {
        const manifest = await quantumDB.initManifest();
        setTheoryManifest(manifest);
      } catch (theoryErr) {
        console.error('Error fetching theory manifest:', theoryErr);
      }

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
    } else {
      // If questions exist, just load theory manifest
      try {
        const manifest = await quantumDB.initManifest();
        setTheoryManifest(manifest);
      } catch (err) {
        console.error('Error loading theory manifest on startup', err);
      }
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  return (
    <div className="space-y-2">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-mono">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Modalità offline — la sincronizzazione riprenderà quando la connessione sarà disponibile.</span>
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-surface border border-surface-border rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg text-accent relative">
            {syncStatus === 'checking' || syncStatus === 'syncing' ? (
              <CloudCog className="w-5 h-5 animate-pulse" />
            ) : !isOnline ? (
              <WifiOff className="w-5 h-5 text-amber-500" />
            ) : (
              <Database className="w-5 h-5" />
            )}
            {meta.totalQuestions && syncStatus !== 'syncing' && (
              <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-surface ${isOnline ? 'bg-success' : 'bg-amber-500'}`}></div>
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
              {!isOnline ? 'Offline — dati locali' :
               syncStatus === 'checking' ? 'Verifica aggiornamenti...' :
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
          disabled={isSyncing || !isOnline}
          className="gap-2"
        >
          {isSyncing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : syncStatus === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-success" />
          ) : !isOnline ? (
            <WifiOff className="w-4 h-4 text-amber-500" />
          ) : meta.totalQuestions ? (
            <RefreshCw className="w-4 h-4" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {!isOnline ? 'Offline' : isSyncing ? 'Sinc...' : syncStatus === 'success' ? 'Aggiornato' : meta.totalQuestions ? 'Verifica' : 'Scarica'}
          </span>
        </Button>
      </div>
    </div>
  );
}

