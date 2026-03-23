import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Definisco lo schema del database IndexedDB per il Quantum Engine
interface QuantumSchema extends DBSchema {
  manifest: {
    key: string;
    value: {
      version: string;
      updatedAt: string;
      chapters: {
        id: string;
        title: string;
        icon: string;
        description: string;
        tags: string[];
        difficulty: string;
        sectionCount: number;
      }[];
    };
  };
  chapters: {
    key: string;
    value: any; // Il contenuto completo del capitolo
  };
  metadata: {
    key: string;
    value: any;
  };
}

class QuantumEngine {
  private dbPromise: Promise<IDBPDatabase<QuantumSchema>>;
  private readonly DB_NAME = 'QuantumAeroDB';
  private readonly DB_VERSION = 1;

  constructor() {
    this.dbPromise = openDB<QuantumSchema>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('manifest');
        db.createObjectStore('chapters');
        db.createObjectStore('metadata');
      },
    });
  }

  /**
   * Inizializza il motore scaricando solo il manifest (pochi KB).
   * L'interfaccia si carica istantaneamente.
   */
  async initManifest() {
    const db = await this.dbPromise;
    const cachedManifest = await db.get('manifest', 'latest');
    
    // Se abbiamo già il manifest in cache, controlliamo se c'è un aggiornamento
    // (in un'app reale faremmo una HEAD request per l'ETag)
    if (cachedManifest) {
      // Background fetch per aggiornamenti silenziosi
      this.fetchAndCacheManifest().catch(console.error);
      return cachedManifest;
    }

    return await this.fetchAndCacheManifest();
  }

  private async fetchAndCacheManifest() {
    const res = await fetch(`${import.meta.env.BASE_URL}db-shards/manifest.json?t=${Date.now()}`);
    if (!res.ok) throw new Error('Failed to fetch manifest');
    const manifest = await res.json();
    
    const db = await this.dbPromise;

    // Invalidate chapter cache if manifest version changed
    const oldManifest = await db.get('manifest', 'latest');
    if (oldManifest && oldManifest.version !== manifest.version) {
      console.log(`[QuantumDB] Manifest version changed (${oldManifest.version} → ${manifest.version}), clearing chapter cache`);
      await db.clear('chapters');
    }

    await db.put('manifest', manifest, 'latest');
    return manifest;
  }

  /**
   * Scarica un capitolo specifico SOLO quando l'utente ci clicca sopra.
   * Se è già in IndexedDB, il caricamento è a latenza zero (0ms).
   */
  async getChapter(chapterId: string) {
    const db = await this.dbPromise;
    
    // 1. Controllo la cache locale (IndexedDB)
    const cachedChapter = await db.get('chapters', chapterId);
    if (cachedChapter) {
      console.log(`[QuantumDB] Cache HIT per capitolo: ${chapterId} (Latenza: 0ms)`);
      return cachedChapter;
    }

    // 2. Cache MISS: Scarico il frammento specifico (Sharding)
    console.log(`[QuantumDB] Cache MISS per capitolo: ${chapterId}. Download in corso...`);
    const res = await fetch(`${import.meta.env.BASE_URL}db-shards/${chapterId}.json`);
    if (!res.ok) throw new Error(`Failed to fetch chapter ${chapterId}`);
    
    const chapterData = await res.json();
    
    // 3. Salvo in IndexedDB per la prossima volta
    await db.put('chapters', chapterData, chapterId);
    return chapterData;
  }

  /**
   * Pre-fetch intelligente: scarica i capitoli in background 
   * mentre l'utente legge il primo, per un'esperienza offline perfetta.
   */
  async prefetchChapters(chapterIds: string[]) {
    // Esecuzione in background a bassa priorità
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        chapterIds.forEach(id => this.getChapter(id).catch(() => {}));
      });
    } else {
      setTimeout(() => {
        chapterIds.forEach(id => this.getChapter(id).catch(() => {}));
      }, 2000);
    }
  }

  /**
   * Svuota la cache (utile per debug o aggiornamenti forzati)
   */
  async clearCache() {
    const db = await this.dbPromise;
    await db.clear('manifest');
    await db.clear('chapters');
    console.log('[QuantumDB] Cache svuotata con successo.');
  }
}

export const quantumDB = new QuantumEngine();
