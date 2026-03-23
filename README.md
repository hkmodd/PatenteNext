<div align="center">
<img width="225" height="64" alt="image" src="https://github.com/user-attachments/assets/1b85e376-f1a9-4326-8da8-07c2a042d05a" />

# 🚗 PatenteNext

**Simulatore PWA Open-Source per l'esame della Patente B italiana**

Architettura offline-first · Database Ministeriale 2026 · AI Tutor integrato

[![CI](https://github.com/hkmodd/PatenteNext/actions/workflows/ci.yml/badge.svg)](https://github.com/hkmodd/PatenteNext/actions/workflows/ci.yml)

</div>

---

## ✨ Funzionalità

### 🎯 Simulazione Esame Ufficiale
- **30 domande vero/falso** con timer da **20 minuti**, identico all'esame reale
- Soglia di superamento: **≤ 3 errori** (come la prova ministeriale)
- Domande estratte casualmente dal database ministeriale completo
- Timer persistente — se chiudi e riapri, il tempo continua a scorrere

### 📚 Training Mirato
- **Allenamento per categoria** — scegli tra 25 categorie (segnali, precedenze, sorpasso, alcool, ecc.)
- **Ripasso errori** — sessioni generate automaticamente dalle domande sbagliate
- Accuracy per categoria calcolata sugli ultimi 50 esami

### 🧠 Teoria & Sintesi Rapida
- Capitoli di teoria caricati on-demand da IndexedDB (QuantumDB engine)
- Livelli di difficoltà per ogni capitolo: `EASY` / `MEDIUM` / `HARD` / `CRITICAL`
- Domande di verifica integrate dentro ogni capitolo con AI Tutor

### 🤖 AI Tutor (Google Gemini)
- Spiega **perché** una risposta è corretta o sbagliata
- Accessibile dalla schermata risultati per ogni singola domanda
- Funziona anche dentro i capitoli di teoria
- Completamente opzionale — l'app funziona al 100% anche senza API key

### ⚡ Crack The Matrix
- Database di **regole mnemoniche** per ricordare le risposte trabocchetto
- **Associazioni di parole** — keyword → vero/falso con eccezioni
- Hint in tempo reale durante la simulazione

### 📊 Dashboard & Statistiche
- **Indice di Prontezza** — score composito (pass rate 40% + performance recente 40% + debolezze 20%)
- **Radar Chart** — accuracy sulle top 6 categorie
- **Grafico Progressione** — andamento punteggi ultimi 20 esami
- Streak attuale e record, tasso di successo, esami completati
- **SYS.LOG** — cronologia completa degli ultimi 8 esami

### 🔄 Database & Sync
- Sync dal CDN remoto con **fallback automatico** al database locale bundled
- Validazione formato prima dell'import
- Indicatore online/offline in tempo reale
- **Export/Import** dati utente in JSON per backup e migrazione tra dispositivi

### 📱 PWA Offline-First
- Installabile su mobile e desktop come app nativa
- Service Worker con precache (Vite PWA Plugin)
- Funziona completamente senza connessione dopo il primo caricamento

## 🛠️ Tech Stack

| Layer | Tecnologia |
|-------|-----------|
| UI | React 19 · TypeScript 5.8 |
| Styling | Tailwind CSS 4 |
| State | Zustand (persist middleware) |
| DB locale | IndexedDB via `idb` (QuantumDB engine) |
| Animazioni | Motion (Framer Motion) |
| Grafici | Recharts (Radar + Line) |
| AI | Google Gemini API (`@google/genai`) |
| Build | Vite 6 · vite-plugin-pwa |
| UI Kit | Radix UI · Lucide Icons · CVA |

## 🚀 Setup Locale

```bash
# 1. Clona il repo
git clone https://github.com/hkmodd/PatenteNext.git
cd PatenteNext

# 2. Installa le dipendenze
npm install

# 3. (Opzionale) Configura AI Tutor
cp .env.example .env.local
# Inserisci la tua Google Gemini API key in .env.local

# 4. Avvia il dev server
npm run dev
```

> **Nota:** L'app è completa anche **senza** API key — l'AI Tutor sarà semplicemente non disponibile.

## 📦 Scripts

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Dev server su `localhost:3000` |
| `npm run build` | Build produzione in `dist/` |
| `npm run preview` | Preview del bundle |
| `npm run lint` | Type-check TypeScript |

## 📁 Struttura Progetto

```
src/
├── components/
│   ├── ui/              # Button, Card (design system base)
│   ├── AITutorModal.tsx  # Chat con Google Gemini per spiegazioni
│   ├── DatabaseSync.tsx  # Sync CDN → IndexedDB con fallback locale
│   ├── LazyImage.tsx     # Caricamento lazy per immagini domande
│   ├── MatrixModal.tsx   # Regole mnemoniche e associazioni parola
│   ├── TheoryModal.tsx   # Reader capitoli teoria + quiz integrato
│   └── TrainingModal.tsx # Selezione categoria / ripasso errori
├── data/
│   ├── questions.ts      # Tipi Question, funzioni getRandomExam/getExamByCategory
│   ├── theory.ts         # Tipi e struttura capitoli teoria
│   └── matrix.ts         # Regole mnemoniche + word associations
├── lib/
│   ├── db.ts             # IndexedDB helper (syncDatabase, getDatabaseMeta)
│   └── QuantumDB.ts      # Engine IndexedDB per teoria (manifest + chapters)
├── store/
│   └── useAppStore.ts    # Zustand store persistente (stats, history, weaknesses)
├── views/
│   ├── Dashboard.tsx     # Home: azioni, stats, charts, history
│   ├── QuizEngine.tsx    # Motore quiz con timer, navigazione, Matrix hints
│   └── Results.tsx       # Risultati con analisi errori + AI Tutor per-domanda
└── App.tsx               # Router a 3 viste (dashboard → quiz → results)
```

## 📜 Licenza

MIT
