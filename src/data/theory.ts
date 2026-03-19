export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'CRITICAL';

export interface TrickQuestion {
  question: string;
  isTrue: boolean;
  explanation: string;
}

export interface TheorySection {
  id: string;
  subtitle: string;
  paragraphs: string[];
  alerts?: string[];
  images?: string[];
  trickQuestions?: TrickQuestion[];
  mnemonics?: string[];
  relatedQuizIds?: string[];
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
  'definizioni-generali-doveri-strada': {
    id: 'definizioni-generali-doveri-strada',
    title: '1. Definizioni Generali e Doveri',
    description: 'Classificazione delle strade, parti della strada e classificazione dei veicoli.',
    difficulty: 'EASY',
    tags: ['carreggiata', 'corsia', 'veicoli', 'autostrada'],
    sections: [
      {
        id: 'strada-carreggiata-corsia',
        subtitle: 'Strada, Carreggiata e Corsia',
        paragraphs: [
          'La STRADA è l\'area ad uso pubblico destinata alla circolazione dei pedoni, dei veicoli e degli animali. Comprende carreggiate, banchine, marciapiedi e piste ciclabili.',
          'La CARREGGIATA è la parte della strada destinata al transito dei veicoli. È composta da una o più corsie di marcia. NON comprende i marciapiedi, le banchine o le piste ciclabili.',
          'La CORSIA è una parte longitudinale della carreggiata, di larghezza idonea a consentire il transito di una sola fila di veicoli.'
        ],
        alerts: [
          'ATTENZIONE: La carreggiata NON comprende le banchine e i marciapiedi. La strada invece comprende tutto.'
        ],
        trickQuestions: [
          {
            question: 'La carreggiata comprende le piazzole di sosta.',
            isTrue: false,
            explanation: 'Falso. Le piazzole di sosta sono fuori dalla carreggiata.'
          }
        ]
      }
    ]
  },
  'segnali-pericolo': {
    id: 'segnali-pericolo',
    title: '2. Segnali di Pericolo',
    description: 'Preannunciano situazioni di pericolo, richiedendo di moderare la velocità.',
    difficulty: 'MEDIUM',
    tags: ['pericolo', 'triangoli', '150m'],
    sections: [
      {
        id: 'regole-pericolo',
        subtitle: 'Regole Generali',
        paragraphs: [
          'I segnali di pericolo hanno forma triangolare con vertice verso l\'alto, bordo rosso e sfondo bianco.',
          'Sono posti di norma a 150 metri prima del pericolo.'
        ],
        mnemonics: ['Tutti i segnali di pericolo si trovano a 150 metri, tranne la Croce di S. Andrea (immediatamente prima del binario).']
      }
    ]
  },
  'segnali-divieto': {
    id: 'segnali-divieto',
    title: '3. Segnali di Divieto',
    description: 'Vietano il transito, determinate manovre o impongono limiti.',
    difficulty: 'MEDIUM',
    tags: ['divieto', 'tondi', 'rosso'],
    sections: [
      {
        id: 'divieto-transito-sosta',
        subtitle: 'Divieti di Transito e Sosta',
        paragraphs: [
          'Hanno forma circolare con bordo rosso e sfondo bianco.',
          'Il Divieto di Transito (cerchio bianco con bordo rosso) vieta la circolazione in entrambi i sensi a TUTTI i veicoli.',
          'Il Senso Vietato (disco rosso con barra bianca orizzontale) vieta di entrare in quella strada, ma i veicoli possono provenire dal senso opposto.'
        ]
      }
    ]
  },
  'segnali-obbligo': {
    id: 'segnali-obbligo',
    title: '4. Segnali di Obbligo',
    description: 'Impongono un comportamento specifico, come direzioni obbligatorie o limiti minimi.',
    difficulty: 'EASY',
    tags: ['obbligo', 'tondi', 'blu'],
    sections: [
      {
        id: 'direzioni-obbligatorie',
        subtitle: 'Direzioni Obbligatorie',
        paragraphs: [
          'Hanno forma circolare con sfondo blu e simbolo bianco.',
          'Indicano l\'unica direzione consentita o le uniche direzioni consentite.'
        ]
      }
    ]
  },
  'segnali-precedenza': {
    id: 'segnali-precedenza',
    title: '5. Segnali di Precedenza',
    description: 'Regolano il diritto di precedenza agli incroci e nei sensi unici alternati.',
    difficulty: 'CRITICAL',
    tags: ['precedenza', 'stop', 'incroci'],
    sections: [
      {
        id: 'dare-precedenza-stop',
        subtitle: 'Dare Precedenza e STOP',
        paragraphs: [
          'DARE PRECEDENZA (triangolo rovesciato): Obbliga a dare la precedenza a destra e a sinistra. Non c\'è l\'obbligo di fermarsi se non arriva nessuno.',
          'STOP (ottagono rosso): Obbliga a FERMARSI SEMPRE in corrispondenza della striscia trasversale, anche se non c\'è nessuno, e dare precedenza a destra e sinistra.'
        ],
        alerts: ['RITIRO PATENTE: Non fermarsi allo STOP comporta sanzioni gravissime e decurtazione di 6 punti (12 per neopatentati).']
      }
    ]
  },
  'segnaletica-orizzontale-ostacoli': {
    id: 'segnaletica-orizzontale-ostacoli',
    title: '6. Segnaletica Orizzontale e Ostacoli',
    description: 'Strisce, scritte e simboli tracciati sulla pavimentazione stradale.',
    difficulty: 'MEDIUM',
    tags: ['strisce', 'asfalto', 'attraversamenti'],
    sections: [
      {
        id: 'strisce-longitudinali',
        subtitle: 'Strisce Longitudinali',
        paragraphs: [
          'STRISCIA CONTINUA: Non può MAI essere oltrepassata. Vieta il sorpasso se per farlo bisogna invadere l\'altra corsia.',
          'STRISCIA DISCONTINUA (tratteggiata): Può essere oltrepassata per sorpassare o svoltare, se le condizioni di sicurezza lo permettono.'
        ]
      }
    ]
  },
  'semafori-vigili': {
    id: 'semafori-vigili',
    title: '7. Semafori e Agenti del Traffico',
    description: 'Regolazione del traffico tramite impianti luminosi e segnalazioni manuali.',
    difficulty: 'MEDIUM',
    tags: ['semaforo', 'vigile', 'luci'],
    sections: [
      {
        id: 'luci-semaforo',
        subtitle: 'Significato delle Luci',
        paragraphs: [
          'ROSSO: Arresto assoluto.',
          'GIALLO FISSO: Obbligo di arresto, a meno che non si sia così vicini all\'incrocio da non potersi fermare in sicurezza.',
          'GIALLO LAMPEGGIANTE: Procedere con particolare prudenza (semaforo guasto o spento).',
          'VERDE: Via libera.'
        ]
      },
      {
        id: 'segnalazioni-vigili',
        subtitle: 'Segnalazioni degli Agenti',
        paragraphs: [
          'Braccia a croce: Equivalgono al ROSSO per chi incrocia le braccia.',
          'Braccia parallele alla nostra direzione: Equivalgono al VERDE.',
          'Braccio alzato verticalmente: Equivale al GIALLO FISSO (sgomberare l\'incrocio o fermarsi).'
        ],
        mnemonics: ['Il vigile annulla e sostituisce TUTTI gli altri segnali (semafori, cartelli, strisce).']
      }
    ]
  },
  'segnali-indicazione': {
    id: 'segnali-indicazione',
    title: '8. Segnali di Indicazione',
    description: 'Forniscono informazioni su itinerari, località e servizi.',
    difficulty: 'EASY',
    tags: ['indicazione', 'colori', 'autostrada'],
    sections: [
      {
        id: 'colori-indicazione',
        subtitle: 'I Colori dei Segnali',
        paragraphs: [
          'VERDE: Autostrade.',
          'BLU: Strade extraurbane.',
          'BIANCO: Strade urbane (centri abitati).',
          'GIALLO: Segnali temporanei (cantieri).',
          'MARRONE: Luoghi di interesse turistico o storico.'
        ]
      }
    ]
  },
  'segnali-complementari-cantiere': {
    id: 'segnali-complementari-cantiere',
    title: '9. Segnali Complementari e di Cantiere',
    description: 'Delineatori, segnali temporanei e segnaletica di cantiere.',
    difficulty: 'MEDIUM',
    tags: ['cantiere', 'giallo', 'delineatori'],
    sections: [
      {
        id: 'segnali-temporanei',
        subtitle: 'Segnaletica Temporanea',
        paragraphs: [
          'I segnali temporanei per cantieri stradali hanno lo sfondo GIALLO.',
          'In caso di contrasto, la segnaletica temporanea gialla PREVALE su quella permanente.'
        ]
      }
    ]
  },
  'pannelli-integrativi': {
    id: 'pannelli-integrativi',
    title: '10. Pannelli Integrativi',
    description: 'Pannelli che completano il significato dei segnali verticali.',
    difficulty: 'MEDIUM',
    tags: ['pannelli', 'distanza', 'estesa'],
    sections: [
      {
        id: 'distanza-vs-estesa',
        subtitle: 'Distanza vs Estesa',
        paragraphs: [
          'Distanza: Indica a quanti metri/km si trova il pericolo o la prescrizione (es. "300 m").',
          'Estesa: Indica la lunghezza del tratto interessato dal pericolo o prescrizione. È caratterizzato da DUE FRECCE nere ai lati della misura (es. "↑ 3 km ↑").'
        ]
      }
    ]
  },
  'limiti-di-velocita': {
    id: 'limiti-di-velocita',
    title: '11. Limiti di Velocità',
    description: 'Limiti massimi consentiti e obbligo di regolare la velocità.',
    difficulty: 'HARD',
    tags: ['velocità', 'limiti', 'autostrada', 'neopatentati'],
    sections: [
      {
        id: 'limiti-generali',
        subtitle: 'Limiti Generali (Patente B)',
        paragraphs: [
          'Centri abitati: 50 km/h.',
          'Strade extraurbane secondarie: 90 km/h.',
          'Strade extraurbane principali: 110 km/h (90 in caso di pioggia).',
          'Autostrade: 130 km/h (110 in caso di pioggia).'
        ]
      },
      {
        id: 'limiti-neopatentati',
        subtitle: 'Limiti per Neopatentati (primi 3 anni)',
        paragraphs: [
          'Strade extraurbane principali: MAX 90 km/h.',
          'Autostrade: MAX 100 km/h.'
        ]
      }
    ]
  },
  'distanza-di-sicurezza': {
    id: 'distanza-di-sicurezza',
    title: '12. Distanza di Sicurezza',
    description: 'Calcolo e mantenimento della distanza dal veicolo che precede.',
    difficulty: 'HARD',
    tags: ['distanza', 'frenatura', 'reazione'],
    sections: [
      {
        id: 'calcolo-distanza',
        subtitle: 'Come si calcola',
        paragraphs: [
          'La distanza di sicurezza deve essere almeno uguale allo SPAZIO PERCORSO NEL TEMPO DI REAZIONE (circa 1 secondo).',
          'Aumenta se: la strada è bagnata/innevata, il veicolo è carico, i freni/pneumatici sono usurati, il conducente è stanco.'
        ],
        trickQuestions: [
          {
            question: 'La distanza di sicurezza deve essere almeno uguale allo spazio di frenatura.',
            isTrue: false,
            explanation: 'Falso. Deve essere almeno uguale allo spazio percorso nel tempo di reazione.'
          }
        ]
      }
    ]
  },
  'norme-di-circolazione': {
    id: 'norme-di-circolazione',
    title: '13. Norme di Circolazione',
    description: 'Posizione dei veicoli sulla carreggiata, cambio di direzione e corsia.',
    difficulty: 'MEDIUM',
    tags: ['carreggiata', 'destra', 'svolta'],
    sections: [
      {
        id: 'posizione-veicoli',
        subtitle: 'Posizione sulla carreggiata',
        paragraphs: [
          'I veicoli devono circolare sulla parte destra della carreggiata e in prossimità del margine destro, anche quando la strada è libera.',
          'Nelle strade a due o più corsie per senso di marcia, si deve percorrere la corsia più libera a destra. Le corsie di sinistra sono riservate al sorpasso.'
        ]
      }
    ]
  },
  'precedenza-incroci': {
    id: 'precedenza-incroci',
    title: '14. Precedenza agli Incroci',
    description: 'Regole per stabilire l\'ordine di transito nelle intersezioni.',
    difficulty: 'CRITICAL',
    tags: ['incroci', 'precedenza', 'destra', 'tram'],
    sections: [
      {
        id: 'regola-generale',
        subtitle: 'La Regola Generale',
        paragraphs: [
          'Negli incroci non segnalati, si ha l\'obbligo di dare la precedenza a chi proviene da DESTRA.',
          'Il TRAM e i veicoli in emergenza (con sirena e lampeggiante) hanno la precedenza assoluta su tutti.'
        ]
      }
    ]
  },
  'sorpasso': {
    id: 'sorpasso',
    title: '15. Sorpasso',
    description: 'Fasi del sorpasso, divieti e sorpasso a destra.',
    difficulty: 'CRITICAL',
    tags: ['sorpasso', 'sinistra', 'destra', 'divieti'],
    sections: [
      {
        id: 'divieti-sorpasso',
        subtitle: 'Quando è vietato sorpassare',
        paragraphs: [
          'In prossimità e in corrispondenza di curve e dossi su strade a due corsie a doppio senso.',
          'Agli incroci non regolati da semaforo o vigile.',
          'Ai passaggi a livello senza barriere.',
          'Quando il veicolo che precede si è fermato per far attraversare i pedoni.'
        ]
      },
      {
        id: 'sorpasso-destra',
        subtitle: 'Sorpasso a Destra',
        paragraphs: [
          'È consentito SOLO in due casi:',
          '1. Quando il veicolo da sorpassare ha segnalato l\'intenzione di svoltare a sinistra.',
          '2. Quando il tram marcia al centro della strada e c\'è spazio sufficiente a destra.'
        ]
      }
    ]
  },
  'fermata-sosta-arresto': {
    id: 'fermata-sosta-arresto',
    title: '16. Fermata, Sosta e Arresto',
    description: 'Differenza tra fermata e sosta, divieti e parcheggio.',
    difficulty: 'MEDIUM',
    tags: ['sosta', 'fermata', 'parcheggio'],
    sections: [
      {
        id: 'differenza-fermata-sosta',
        subtitle: 'Fermata vs Sosta',
        paragraphs: [
          'FERMATA: Temporanea sospensione della marcia per far salire/scendere persone. Il conducente deve essere presente e pronto a ripartire.',
          'SOSTA: Sospensione della marcia protratta nel tempo, con possibilità per il conducente di allontanarsi.'
        ],
        mnemonics: ['Il divieto di SOSTA consente la FERMATA. Il divieto di FERMATA vieta ENTRAMBE.']
      }
    ]
  },
  'norme-varie-autostrade-pannelli': {
    id: 'norme-varie-autostrade-pannelli',
    title: '17. Norme Varie e Autostrade',
    description: 'Norme specifiche per autostrade, strade extraurbane principali e pannelli.',
    difficulty: 'MEDIUM',
    tags: ['autostrada', 'pedaggio', 'emergenza', 'inversione'],
    sections: [
      {
        id: 'divieti-autostrada',
        subtitle: 'Divieti Assoluti',
        paragraphs: [
          'È assolutamente vietato: fare retromarcia, fare inversione di marcia, circolare sulla corsia di emergenza (se non per guasto o malessere).',
          'Sanzioni: Ritiro della patente e fermo del veicolo.'
        ]
      }
    ]
  },
  'luci-dispositivi-acustici': {
    id: 'luci-dispositivi-acustici',
    title: '18. Luci e Dispositivi Acustici',
    description: 'Quando accendere i fari, uso dei dispositivi acustici e spie.',
    difficulty: 'HARD',
    tags: ['luci', 'fari', 'spie', 'abbaglianti'],
    sections: [
      {
        id: 'quando-accendere',
        subtitle: 'Quando usare le luci',
        paragraphs: [
          'Fuori dai centri abitati (autostrade e strade extraurbane): Anabbaglianti SEMPRE ACCESI, anche di giorno.',
          'Nei centri abitati: Obbligatori da mezz\'ora dopo il tramonto a mezz\'ora prima del sorgere del sole.',
          'Abbaglianti: Solo fuori dai centri abitati quando non si incrociano o seguono altri veicoli.'
        ]
      }
    ]
  },
  'cinture-casco-sicurezza': {
    id: 'cinture-casco-sicurezza',
    title: '19. Cinture, Casco e Sicurezza',
    description: 'Cinture, seggiolini per bambini, casco e abbigliamento.',
    difficulty: 'EASY',
    tags: ['cinture', 'casco', 'seggiolini', 'airbag'],
    sections: [
      {
        id: 'cinture-seggiolini',
        subtitle: 'Cinture e Seggiolini',
        paragraphs: [
          'Le cinture sono obbligatorie per TUTTI gli occupanti (anteriori e posteriori).',
          'I bambini sotto i 1.50m di altezza devono usare sistemi di ritenuta omologati adeguati al loro peso.',
          'L\'Airbag può essere disattivato (lato passeggero) SOLO se si posiziona un seggiolino per bambini rivolto all\'indietro.'
        ]
      }
    ]
  },
  'patente-punti-documenti': {
    id: 'patente-punti-documenti',
    title: '20. Patente, Punti e Documenti',
    description: 'Categorie di patenti, sistema a punti, revisione e documenti a bordo.',
    difficulty: 'HARD',
    tags: ['patente', 'punti', 'revisione', 'libretto'],
    sections: [
      {
        id: 'sistema-punti',
        subtitle: 'Il Sistema a Punti',
        paragraphs: [
          'Si parte con 20 punti. Se ne perdono per infrazioni, se ne guadagnano 2 ogni 2 anni senza infrazioni (max 30).',
          'Neopatentati: Decurtazione punti RADDOPPIATA per i primi 3 anni.'
        ]
      }
    ]
  },
  'incidenti-stradali-comportamenti': {
    id: 'incidenti-stradali-comportamenti',
    title: '21. Incidenti e Comportamenti',
    description: 'Comportamento in caso di incidente, omissione di soccorso.',
    difficulty: 'CRITICAL',
    tags: ['incidente', 'soccorso', 'feriti', 'omissione'],
    sections: [
      {
        id: 'primo-soccorso',
        subtitle: 'Regole di Primo Soccorso',
        paragraphs: [
          'Obbligo di fermarsi e prestare assistenza. L\'omissione di soccorso è un REATO PENALE.',
          'NON spostare i feriti gravi a meno che non ci sia pericolo imminente (es. incendio).',
          'NON togliere il casco a un motociclista infortunato.',
          'NON dare da bere o da mangiare ai feriti.'
        ]
      }
    ]
  },
  'alcool-droga-primo-soccorso': {
    id: 'alcool-droga-primo-soccorso',
    title: '22. Alcool, Droga e Primo Soccorso',
    description: 'Alcol, droghe, farmaci, stanchezza e distrazioni.',
    difficulty: 'CRITICAL',
    tags: ['alcol', 'droghe', 'stanchezza', 'ebbrezza'],
    sections: [
      {
        id: 'alcol-droghe',
        subtitle: 'Alcol e Sostanze Stupefacenti',
        paragraphs: [
          'Il limite legale di tasso alcolemico è 0,5 g/l per i conducenti esperti.',
          'Per i NEOPATENTATI (primi 3 anni) e i conducenti professionali il limite è ZERO (0,0 g/l).',
          'L\'assunzione di droghe è SEMPRE vietata e costituisce reato penale.'
        ],
        alerts: [
          'ATTENZIONE: Il caffè, le docce fredde o altri "rimedi della nonna" NON accelerano lo smaltimento dell\'alcol dal sangue. Solo il tempo funziona.'
        ]
      }
    ]
  },
  'responsabilita-civile-penale-e-assicurazione': {
    id: 'responsabilita-civile-penale-e-assicurazione',
    title: '23. Responsabilità e Assicurazione',
    description: 'Responsabilità civile, penale e assicurazione obbligatoria.',
    difficulty: 'MEDIUM',
    tags: ['rca', 'assicurazione', 'responsabilità', 'penale'],
    sections: [
      {
        id: 'rca-copertura',
        subtitle: 'Cosa copre la RCA',
        paragraphs: [
          'La RCA (Responsabilità Civile Auto) è OBBLIGATORIA.',
          'Copre i danni causati a TERZI (inclusi i passeggeri del proprio veicolo).',
          'NON copre i danni subiti dal conducente responsabile del sinistro.',
          'Il Fondo di Garanzia per le Vittime della Strada risarcisce i danni causati da veicoli non assicurati o non identificati.'
        ]
      }
    ]
  },
  'consumi-ambiente-inquinamento': {
    id: 'consumi-ambiente-inquinamento',
    title: '24. Consumi e Ambiente',
    description: 'Inquinamento atmosferico, acustico e smaltimento rifiuti.',
    difficulty: 'EASY',
    tags: ['inquinamento', 'rumore', 'ambiente', 'catalizzatore'],
    sections: [
      {
        id: 'ridurre-inquinamento',
        subtitle: 'Come ridurre l\'inquinamento',
        paragraphs: [
          'Evitare accelerate brusche e mantenere una velocità costante.',
          'Spegnere il motore in caso di arresto prolungato (es. passaggio a livello chiuso).',
          'Controllare periodicamente la pressione degli pneumatici e i filtri.'
        ]
      }
    ]
  },
  'elementi-veicolo-manutenzione-comportamenti': {
    id: 'elementi-veicolo-manutenzione-comportamenti',
    title: '25. Veicolo e Manutenzione',
    description: 'Motore, pneumatici, freni e manutenzione ordinaria.',
    difficulty: 'HARD',
    tags: ['motore', 'pneumatici', 'freni', 'olio'],
    sections: [
      {
        id: 'pneumatici',
        subtitle: 'Pneumatici e Aderenza',
        paragraphs: [
          'Lo spessore minimo del battistrada per gli autoveicoli è 1,6 mm.',
          'Pressione troppo bassa: consumo eccessivo ai bordi, rischio di scoppio, maggiore consumo di carburante.',
          'Pressione troppo alta: consumo eccessivo al centro, minore aderenza.'
        ]
      }
    ]
  }
};

export const getAllTheoryCategories = () => Object.keys(theoryManual);
