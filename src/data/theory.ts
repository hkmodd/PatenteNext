export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'CRITICAL';

export interface TrickQuestion {
  question: string;
  isTrue: boolean;
  explanation: string;
}

export interface TheorySection {
  id: string; // Unique ID for deep linking and analytics
  subtitle: string;
  paragraphs: string[];
  alerts?: string[]; // Per note critiche, es. "Ritiro Patente" o "Errore Comune"
  images?: string[]; // Array di URL immagini (es. segnali stradali)
  trickQuestions?: TrickQuestion[]; // Domande trabocchetto ministeriali
  mnemonics?: string[]; // Regole mnemoniche per la memorizzazione rapida
  relatedQuizIds?: string[]; // ID dei quiz correlati per cross-referencing
}

export interface TheoryChapter {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  tags: string[];
  sections: TheorySection[];
}

export const theoryManual: Record<string, TheoryChapter> = {
  'precedenza-incroci': {
    id: 'precedenza-incroci',
    title: 'Precedenza agli Incroci',
    description: 'Le regole fondamentali per stabilire l\'ordine di transito nelle intersezioni. Un errore qui è fatale sia all\'esame che nella realtà.',
    difficulty: 'CRITICAL',
    tags: ['incroci', 'precedenza', 'svolta', 'tram', 'emergenza'],
    sections: [
      {
        id: 'regola-generale',
        subtitle: 'La Regola Generale (Precedenza a Destra)',
        paragraphs: [
          'Quando due veicoli stanno per impegnare un incrocio, o le loro traiettorie stanno comunque per intersecarsi, si ha l\'obbligo di dare la precedenza a chi proviene da DESTRA, salvo diversa segnalazione.',
          'Questa regola vale sempre negli incroci non segnalati (privi di cartelli, semafori o vigili).'
        ],
        alerts: [
          'ATTENZIONE: Dare la precedenza a destra NON significa passare senza guardare a sinistra. Bisogna sempre usare la massima prudenza e assicurarsi che chi arriva da sinistra ci stia effettivamente concedendo la precedenza.'
        ],
        trickQuestions: [
          {
            question: 'Negli incroci non segnalati, ha la precedenza il veicolo che marcia a velocità più elevata.',
            isTrue: false,
            explanation: 'Falso. La velocità non conferisce MAI il diritto di precedenza. Vale sempre la regola della precedenza a destra.'
          },
          {
            question: 'Si ha l\'obbligo di dare la precedenza a destra e a sinistra in presenza del segnale DARE PRECEDENZA.',
            isTrue: true,
            explanation: 'Vero. Il segnale a triangolo rovesciato impone di dare precedenza in entrambi i sensi.'
          }
        ]
      },
      {
        id: 'eccezioni-assolute',
        subtitle: 'Eccezioni Assolute (Chi passa sempre)',
        paragraphs: [
          'Esistono dei veicoli che, per la loro natura o funzione, godono della precedenza assoluta su tutti gli altri, indipendentemente dalla loro provenienza (destra o sinistra).',
          'I veicoli su rotaia (TRAM e TRENI) hanno sempre la precedenza, a meno che non ci sia un semaforo rosso o un segnale di STOP a fermarli.',
          'I veicoli in servizio di emergenza (Ambulanze, Polizia, Vigili del Fuoco) hanno la precedenza assoluta SOLO SE hanno la sirena spiegata e il lampeggiante blu acceso.'
        ],
        mnemonics: [
          'TRAM = Rotaie = Precedenza assoluta (tranne col rosso/stop).',
          'AMBULANZA = Sirena + Lampeggiante = Precedenza assoluta. Se spenti = Veicolo normale.'
        ],
        trickQuestions: [
          {
            question: 'Il tram ha sempre la precedenza, anche in presenza del semaforo rosso.',
            isTrue: false,
            explanation: 'Falso. Il tram deve rispettare i semafori e le segnalazioni dei vigili.'
          },
          {
            question: 'Un\'ambulanza ha sempre la precedenza, anche se non ha in funzione la sirena.',
            isTrue: false,
            explanation: 'Falso. Senza sirena e lampeggiante blu accesi, l\'ambulanza è soggetta alle normali regole di precedenza.'
          }
        ]
      },
      {
        id: 'svolta-sinistra',
        subtitle: 'Svolta a Sinistra',
        paragraphs: [
          'Quando si svolta a sinistra, si taglia la strada ai veicoli che provengono di fronte e da destra.',
          'Pertanto, chi svolta a sinistra deve dare la precedenza a:',
          '1. Chi proviene da destra.',
          '2. Chi proviene di fronte (che va dritto o svolta a sua volta a destra).',
          '3. I pedoni che attraversano la strada in cui ci si sta immettendo.'
        ],
        mnemonics: [
          'Chi svolta a SINISTRA, aspetta (quasi) TUTTI: Destra, Fronte e Pedoni.'
        ]
      },
      {
        id: 'immissione-flusso',
        subtitle: 'Immissione nel Flusso della Circolazione',
        paragraphs: [
          'Chi si immette nel flusso della circolazione (es. uscendo da un parcheggio, da un passo carrabile, da una strada privata o da un sentiero sterrato) deve dare la precedenza a TUTTI i veicoli in transito, sia da destra che da sinistra.'
        ]
      }
    ]
  },
  'limiti-di-velocita': {
    id: 'limiti-di-velocita',
    title: 'Limiti di Velocità e Pericoli',
    description: 'I limiti massimi consentiti dal Codice della Strada in base al tipo di veicolo, alla strada e all\'esperienza del conducente.',
    difficulty: 'HARD',
    tags: ['velocità', 'limiti', 'autostrada', 'neopatentati', 'meteo'],
    sections: [
      {
        id: 'limiti-generali',
        subtitle: 'Limiti Generali per Autovetture (Patente B)',
        paragraphs: [
          'I limiti massimi di velocità per le autovetture (fino a 3.5t) in condizioni normali sono:',
          '• Centri abitati (strade urbane): 50 km/h (elevabili a 70 km/h solo in strade urbane di scorrimento con apposito segnale).',
          '• Strade extraurbane secondarie (statali, provinciali a 1 corsia per senso): 90 km/h.',
          '• Strade extraurbane principali (superstrade a carreggiate separate): 110 km/h.',
          '• Autostrade: 130 km/h (elevabili a 150 km/h solo su tratte a 3 corsie con tutor e asfalto drenante, se segnalato).'
        ]
      },
      {
        id: 'condizioni-meteo',
        subtitle: 'Condizioni Meteorologiche Avverse',
        paragraphs: [
          'In caso di precipitazioni atmosferiche (pioggia, grandine), i limiti massimi si abbassano automaticamente, anche in assenza di cartelli specifici:',
          '• Autostrade: scende da 130 a 110 km/h.',
          '• Strade extraurbane principali: scende da 110 a 90 km/h.',
          'In caso di nebbia fitta (visibilità inferiore a 100 metri), il limite massimo può essere abbassato a 50 km/h se segnalato dall\'apposito pannello luminoso.'
        ],
        alerts: [
          'ERRORE COMUNE: La pioggia non abbassa il limite sulle strade extraurbane secondarie (rimane 90 km/h) né nei centri abitati (rimane 50 km/h).'
        ],
        trickQuestions: [
          {
            question: 'In caso di pioggia, il limite massimo di velocità sulle strade extraurbane secondarie scende a 70 km/h.',
            isTrue: false,
            explanation: 'Falso. Sulle strade extraurbane secondarie il limite rimane 90 km/h anche in caso di pioggia.'
          }
        ]
      },
      {
        id: 'limiti-neopatentati',
        subtitle: 'Limiti per Neopatentati',
        paragraphs: [
          'Per i primi 3 anni dal conseguimento della Patente B, si è considerati "Neopatentati".',
          'I limiti massimi sono più restrittivi:',
          '• Autostrade: massimo 100 km/h (invece di 130).',
          '• Strade extraurbane principali: massimo 90 km/h (invece di 110).'
        ],
        alerts: [
          'RITIRO PATENTE: Superare i limiti di velocità di oltre 40 km/h comporta la sospensione della patente. Per i neopatentati, i punti decurtati per ogni infrazione sono RADDOPPIATI.'
        ]
      }
    ]
  },
  'patente-punti-documenti': {
    id: 'patente-punti-documenti',
    title: 'Patenti, Punti e Documenti',
    description: 'Classificazione delle patenti, validità, sistema a punti e documenti obbligatori a bordo.',
    difficulty: 'MEDIUM',
    tags: ['patente', 'punti', 'documenti', 'rinnovo', 'sospensione'],
    sections: [
      {
        id: 'veicoli-patente-b',
        subtitle: 'Cosa si può guidare con la Patente B',
        paragraphs: [
          'La Patente B consente di guidare:',
          '• Autovetture (fino a 9 posti totali, compreso il conducente).',
          '• Autocarri con massa massima autorizzata non superiore a 3,5 tonnellate.',
          '• Macchine agricole (TUTTE, anche quelle eccezionali).',
          '• Macchine operatrici (SOLO quelle NON eccezionali).',
          '• Motocicli fino a 125 cm3 e 11 kW di potenza (SOLO in Italia).',
          '• Tricicli a motore (se di potenza > 15 kW, solo dopo aver compiuto 21 anni e solo in Italia).'
        ]
      },
      {
        id: 'rinnovo-validita',
        subtitle: 'Rinnovo e Validità',
        paragraphs: [
          'La Patente B deve essere rinnovata periodicamente tramite visita medica per accertare i requisiti fisici e psichici:',
          '• Ogni 10 anni fino al compimento dei 50 anni di età.',
          '• Ogni 5 anni tra i 50 e i 70 anni.',
          '• Ogni 3 anni tra i 70 e gli 80 anni.',
          '• Ogni 2 anni dopo gli 80 anni.'
        ]
      },
      {
        id: 'sistema-punti',
        subtitle: 'Il Sistema a Punti',
        paragraphs: [
          'Ogni patente ha un saldo iniziale di 20 punti.',
          'Se non si commettono infrazioni che comportano la perdita di punti per 2 anni consecutivi, si guadagnano 2 punti (fino a un massimo di 30 punti).',
          'I neopatentati (primi 3 anni) guadagnano 1 punto bonus all\'anno se non commettono infrazioni, ma subiscono la decurtazione DOPPIA dei punti in caso di infrazione.'
        ],
        alerts: [
          'Se si esauriscono tutti i punti (saldo zero), scatta la REVISIONE della patente: bisogna rifare l\'esame di teoria e l\'esame di pratica entro 30 giorni.'
        ]
      }
    ]
  },
  'segnali-pericolo': {
    id: 'segnali-pericolo',
    title: 'Segnali di Pericolo',
    description: 'Preannunciano situazioni di pericolo, richiedendo di moderare la velocità.',
    difficulty: 'EASY',
    tags: ['segnali', 'pericolo', 'triangoli', '150m'],
    sections: [
      {
        id: 'caratteristiche-generali',
        subtitle: 'Caratteristiche Generali',
        paragraphs: [
          'I segnali di pericolo hanno forma triangolare con un vertice rivolto verso l\'alto, bordo rosso e sfondo bianco (giallo se si tratta di cantieri stradali).',
          'Di norma, sono posti a 150 metri prima del pericolo che segnalano, per dare il tempo al conducente di rallentare.'
        ]
      },
      {
        id: 'cunetta-dosso',
        subtitle: 'Cunetta e Dosso',
        paragraphs: [
          'CUNETTA: Preannuncia un tratto di strada in discesa seguito da una salita (una "buca" o avvallamento). Può accumulare acqua in caso di pioggia (rischio aquaplaning).',
          'DOSSO: Preannuncia un tratto di strada in salita seguito da una discesa. La visibilità è limitata.'
        ],
        alerts: [
          'DIVIETI SUL DOSSO: È vietato il sorpasso sul tratto in salita (se la strada è a doppio senso con due sole corsie), ed è sempre vietata l\'inversione di marcia, la sosta e la fermata.'
        ],
        relatedQuizIds: ['q_001']
      }
    ]
  },
  // Placeholder per le altre categorie (saranno espanse dal sistema di scraping)
  'definizioni-generali-doveri-strada': {
    id: 'definizioni-generali-doveri-strada',
    title: 'Definizioni Generali e Doveri',
    description: 'Classificazione dei veicoli e definizioni stradali.',
    difficulty: 'EASY',
    tags: ['definizioni', 'strada', 'carreggiata', 'corsia'],
    sections: [
      {
        id: 'strada-parti',
        subtitle: 'La Strada e le sue parti',
        paragraphs: [
          'La strada comprende carreggiate, banchine, marciapiedi e piste ciclabili.',
          'La carreggiata è la parte destinata al transito dei veicoli (esclude marciapiedi e banchine).'
        ]
      }
    ]
  }
};

// Funzione helper per ottenere la lista di tutte le categorie supportate
export const getAllTheoryCategories = () => Object.keys(theoryManual);
