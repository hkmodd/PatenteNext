<div align="center">

# 🚗 PatenteNext

**Simulatore PWA Open-Source per l'esame della Patente di Guida Italiana**

Architettura offline-first · UI ad alte prestazioni · AI Tutor integrato

[![CI](https://github.com/hkmodd/PatenteNext/actions/workflows/ci.yml/badge.svg)](https://github.com/hkmodd/PatenteNext/actions/workflows/ci.yml)

</div>

---

## ✨ Funzionalità

- **Simulazione d'esame** — 30 domande vero/falso con timer da 20 minuti, come l'esame reale
- **Training mirato** — Esercitati per categoria o ripassa solo gli errori
- **Statistiche avanzate** — Streak, accuracy per categoria, grafici andamento
- **AI Tutor** — Chatbot integrato (Google Gemini) che spiega gli errori
- **Teoria completa** — Tutti i capitoli del Codice della Strada con ricerca
- **PWA offline-first** — Installabile su mobile, funziona senza connessione
- **Database 7000+ domande** — Caricato da IndexedDB con sync incrementale

## 🛠️ Tech Stack

| Layer | Tecnologia |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| State | Zustand (persist) |
| Database | IndexedDB (idb) |
| Animations | Motion (Framer Motion) |
| AI | Google Gemini API |
| Build | Vite 6 + PWA Plugin |
| Charts | Recharts |

## 🚀 Setup Locale

```bash
# 1. Clona il repo
git clone https://github.com/hkmodd/PatenteNext.git
cd PatenteNext

# 2. Installa le dipendenze
npm install

# 3. Configura le variabili d'ambiente (opzionale, serve solo per AI Tutor)
cp .env.example .env.local
# Modifica .env.local con la tua API key di Google Gemini

# 4. Avvia il dev server
npm run dev
```

L'app funziona completamente anche **senza** la Gemini API key — l'AI Tutor sarà semplicemente disabilitato.

## 📦 Build

```bash
npm run build    # Genera il bundle in dist/
npm run preview  # Preview del bundle
npm run lint     # Type check TypeScript
```

## 📁 Struttura Progetto

```
src/
├── components/     # UI components (AITutor, Training, Theory, etc.)
├── data/           # Quiz database, theory content, matrix hints
├── lib/            # IndexedDB helpers, utilities
├── store/          # Zustand store (state management)
├── views/          # Main views (Dashboard, QuizEngine, Results)
└── App.tsx         # Router / main entry
```

## 📜 Licenza

MIT
