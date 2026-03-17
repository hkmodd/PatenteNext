import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, CheckCircle2, Download } from 'lucide-react';
import { Button } from './ui/Button';
import { syncDatabase, getDatabaseMeta } from '../lib/db';

export function DatabaseSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [meta, setMeta] = useState<{ lastSync?: number; totalQuestions?: number }>({});

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/database.json');
      if (!response.ok) throw new Error('Failed to fetch database');
      const data = await response.json();
      
      // Basic validation
      if (!Array.isArray(data) || data.length === 0 || !data[0].id) {
        throw new Error('Invalid database format');
      }

      await syncDatabase(data);
      const m = await getDatabaseMeta();
      setMeta(m);
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Errore durante la sincronizzazione del database.');
    } finally {
      setIsSyncing(false);
    }
  };

  const loadMeta = async () => {
    const m = await getDatabaseMeta();
    setMeta(m);
    
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
        <div className="p-2 bg-accent/10 rounded-lg text-accent">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-sm">Database Ministeriale</h3>
          <p className="text-xs text-secondary font-mono">
            {meta.totalQuestions ? `${meta.totalQuestions} quiz caricati` : 'Non sincronizzato'}
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
        ) : meta.totalQuestions ? (
          <CheckCircle2 className="w-4 h-4 text-success" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {isSyncing ? 'Sincronizzazione...' : meta.totalQuestions ? 'Aggiorna' : 'Scarica'}
      </Button>
    </div>
  );
}
