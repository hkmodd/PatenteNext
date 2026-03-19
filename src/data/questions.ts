export type QuestionCategory = 
  | 'definizioni-generali-doveri-strada'
  | 'segnali-pericolo'
  | 'segnali-divieto'
  | 'segnali-obbligo'
  | 'segnali-precedenza'
  | 'segnaletica-orizzontale-ostacoli'
  | 'semafori-vigili'
  | 'segnali-indicazione'
  | 'segnali-complementari-cantiere'
  | 'pannelli-integrativi'
  | 'limiti-di-velocita'
  | 'distanza-di-sicurezza'
  | 'norme-di-circolazione'
  | 'precedenza-incroci'
  | 'sorpasso'
  | 'fermata-sosta-arresto'
  | 'norme-varie-autostrade-pannelli'
  | 'luci-dispositivi-acustici'
  | 'cinture-casco-sicurezza'
  | 'patente-punti-documenti'
  | 'incidenti-stradali-comportamenti'
  | 'alcool-droga-primo-soccorso'
  | 'responsabilita-civile-penale-e-assicurazione'
  | 'consumi-ambiente-inquinamento'
  | 'elementi-veicolo-manutenzione-comportamenti';

export interface Question {
  id: string;
  text: string;
  answer: boolean; // true = Vero, false = Falso
  category: QuestionCategory;
  imageUrl?: string;
  explanation?: string;
}

// Un campione rappresentativo di domande reali per la Patente B
export const quizDatabase: Question[] = [
  {
    id: "q_001",
    text: "Il segnale raffigurato preannuncia un tratto di strada con pavimentazione irregolare.",
    answer: true,
    category: "segnali-pericolo",
    imageUrl: "https://www.patentati.it/foto/segnali-pericolo/strada-deformata.gif",
    explanation: "Il segnale di 'Strada deformata' preannuncia un tratto di strada in cattivo stato o con pavimentazione irregolare."
  },
  {
    id: "q_002",
    text: "Il segnale raffigurato vieta il transito a tutti i veicoli.",
    answer: false,
    category: "segnali-divieto",
    imageUrl: "https://www.patentati.it/foto/segnali-divieto/divieto-di-transito.gif",
    explanation: "Falso. Il segnale vieta il transito a tutti i veicoli (sia a motore che non), ma la domanda potrebbe essere formulata in modo ingannevole. In questo caso, il segnale di 'Divieto di transito' vieta la circolazione nei due sensi a tutti i veicoli."
  },
  {
    id: "q_003",
    text: "La patente di categoria B abilita a condurre i motocicli di cilindrata fino a 125 cm3 e potenza fino a 11 kW, ma solo in Italia.",
    answer: true,
    category: "patente-punti-documenti",
    explanation: "Vero. Con la patente B è possibile guidare in Italia i veicoli conducibili con la patente A1 (motocicli 125cc, max 11kW)."
  },
  {
    id: "q_004",
    text: "In presenza del segnale raffigurato è consentito il sorpasso dei veicoli a trazione animale.",
    answer: true,
    category: "sorpasso",
    imageUrl: "https://www.patentati.it/foto/segnali-divieto/divieto-di-sorpasso.gif",
    explanation: "Vero. Il segnale vieta di sorpassare i veicoli a motore, eccetto i ciclomotori e i motocicli. È quindi consentito sorpassare veicoli non a motore come quelli a trazione animale o le biciclette, purché non si superi la striscia continua."
  },
  {
    id: "q_005",
    text: "Il limite massimo di velocità per un'autovettura sulle strade extraurbane principali è di 110 km/h.",
    answer: true,
    category: "limiti-di-velocita",
    explanation: "Vero. I limiti generali per le autovetture sono: 50 km/h centri abitati, 90 km/h extraurbane secondarie, 110 km/h extraurbane principali, 130 km/h autostrade."
  },
  {
    id: "q_006",
    text: "Giungendo ad un incrocio in cui la circolazione è regolata da rotatoria, è obbligatorio dare la precedenza ai veicoli già immessi nell'anello.",
    answer: false,
    category: "precedenza-incroci",
    explanation: "Falso. La regola generale (senza segnali) prevede la precedenza a destra (chi si immette). Tuttavia, quasi tutte le rotatorie moderne hanno il segnale di 'Dare precedenza' all'ingresso, ma la domanda parla di regola generale."
  },
  {
    id: "q_007",
    text: "Lo specchio retrovisore centrale di un autoveicolo deve essere regolato in modo da rientrare nel campo visivo del conducente.",
    answer: true,
    category: "patente-punti-documenti",
    explanation: "Vero. Lo specchio retrovisore centrale deve essere regolato in modo da garantire la massima visibilità posteriore attraverso il lunotto."
  },
  {
    id: "q_008",
    text: "Il segnale raffigurato indica l'inizio di un'autostrada.",
    answer: false,
    category: "segnali-obbligo",
    imageUrl: "https://www.patentati.it/foto/segnali-indicazione/strada-extraurbana-principale.gif",
    explanation: "Falso. Il segnale blu con la sagoma bianca di un'autovettura indica l'inizio di una strada extraurbana principale, non di un'autostrada (che ha sfondo verde)."
  },
  {
    id: "q_009",
    text: "È vietato il sorpasso in prossimità delle curve su strade a due corsie a doppio senso di marcia.",
    answer: true,
    category: "sorpasso",
    explanation: "Vero. Sulle strade a due corsie e a doppio senso di marcia, la scarsa visibilità in curva rende il sorpasso estremamente pericoloso e quindi vietato."
  },
  {
    id: "q_010",
    text: "La distanza di sicurezza deve essere almeno uguale allo spazio di frenatura.",
    answer: false,
    category: "distanza-di-sicurezza",
    explanation: "Falso. La distanza di sicurezza deve essere almeno uguale allo spazio percorso nel tempo di reazione, non allo spazio di frenatura totale."
  },
  {
    id: "q_011",
    text: "Il segnale raffigurato indica una strada senza uscita.",
    answer: true,
    category: "segnali-indicazione",
    imageUrl: "https://www.patentati.it/foto/segnali-indicazione/strada-senza-uscita.gif",
    explanation: "Vero. Il segnale indica che la strada non ha sbocco per i veicoli."
  },
  {
    id: "q_012",
    text: "È consentito l'uso del clacson nei centri abitati in ogni caso di pericolo immediato.",
    answer: true,
    category: "luci-dispositivi-acustici",
    explanation: "Vero. Nei centri abitati l'uso dei segnalatori acustici è vietato, tranne nei casi di effettivo e immediato pericolo."
  },
  {
    id: "q_013",
    text: "Il segnale raffigurato vieta la sosta ma non la fermata.",
    answer: true,
    category: "segnali-divieto",
    imageUrl: "https://www.patentati.it/foto/segnali-divieto/divieto-di-sosta.gif",
    explanation: "Vero. Il segnale di divieto di sosta consente la fermata (breve interruzione della marcia per far salire/scendere passeggeri), purché non si intralci la circolazione."
  },
  {
    id: "q_014",
    text: "La spia di colore rosso contrassegnata dal simbolo in figura indica che il freno di stazionamento è inserito.",
    answer: true,
    category: "luci-dispositivi-acustici",
    imageUrl: "https://www.patentati.it/foto/spie/freno-a-mano.gif",
    explanation: "Vero. La spia rossa con il punto esclamativo o la lettera P indica l'inserimento del freno a mano o un'anomalia all'impianto frenante."
  },
  {
    id: "q_015",
    text: "Il casco è obbligatorio per i conducenti di ciclomotori a due ruote, ma non per i passeggeri maggiorenni.",
    answer: false,
    category: "cinture-casco-sicurezza",
    explanation: "Falso. L'uso del casco è obbligatorio per tutti (conducenti e passeggeri, maggiorenni e minorenni) sui veicoli a due ruote."
  },
  {
    id: "q_016",
    text: "Il segnale raffigurato preannuncia un passaggio a livello senza barriere.",
    answer: true,
    category: "segnali-pericolo",
    imageUrl: "https://www.patentati.it/foto/segnali-pericolo/passaggio-a-livello-senza-barriere.gif",
    explanation: "Vero. Il segnale con la locomotiva preannuncia un passaggio a livello sprovvisto di barriere o semibarriere."
  },
  {
    id: "q_017",
    text: "In caso di nebbia fitta, è opportuno accendere le luci abbaglianti per vedere meglio.",
    answer: false,
    category: "luci-dispositivi-acustici",
    explanation: "Falso. Le luci abbaglianti creano un 'muro bianco' riflettendosi sulle goccioline di nebbia, peggiorando la visibilità. Vanno usati gli anabbaglianti e i fendinebbia."
  },
  {
    id: "q_018",
    text: "Il segnale raffigurato indica l'obbligo di svoltare a destra.",
    answer: true,
    category: "segnali-obbligo",
    imageUrl: "https://www.patentati.it/foto/segnali-obbligo/direzione-obbligatoria-destra.gif",
    explanation: "Vero. Il segnale circolare blu con freccia bianca indica la direzione obbligatoria."
  },
  {
    id: "q_019",
    text: "L'assicurazione RCA (Responsabilità Civile Auto) copre anche i danni subiti dal conducente responsabile del sinistro.",
    answer: false,
    category: "responsabilita-civile-penale-e-assicurazione",
    explanation: "Falso. La RCA copre i danni causati a terzi (inclusi i passeggeri del proprio veicolo), ma NON i danni fisici subiti dal conducente che ha torto."
  },
  {
    id: "q_020",
    text: "Il segnale raffigurato indica un attraversamento pedonale.",
    answer: true,
    category: "segnali-pericolo",
    imageUrl: "https://www.patentati.it/foto/segnali-pericolo/attraversamento-pedonale.gif",
    explanation: "Vero. Il segnale triangolare preannuncia un attraversamento pedonale non regolato da semaforo."
  },
  {
    id: "q_021",
    text: "La distanza di sicurezza va aumentata se la strada è bagnata o innevata.",
    answer: true,
    category: "distanza-di-sicurezza",
    explanation: "Vero. In condizioni di scarsa aderenza (pioggia, neve, ghiaccio), lo spazio di frenatura aumenta, quindi bisogna aumentare la distanza di sicurezza."
  },
  {
    id: "q_022",
    text: "Il segnale raffigurato vieta il sorpasso tra autovetture.",
    answer: false,
    category: "segnali-divieto",
    imageUrl: "https://www.patentati.it/foto/segnali-divieto/divieto-di-sorpasso-mezzi-pesanti.gif",
    explanation: "Falso. Il segnale (camion rosso, auto nera) vieta il sorpasso solo ai veicoli merci di massa superiore a 3,5t. Le autovetture possono sorpassare."
  },
  {
    id: "q_023",
    text: "In autostrada è consentito fare retromarcia solo sulla corsia di emergenza.",
    answer: false,
    category: "norme-varie-autostrade-pannelli",
    explanation: "Falso. La retromarcia in autostrada è ASSOLUTAMENTE VIETATA in qualsiasi corsia, compresa quella di emergenza. Comporta il ritiro della patente."
  },
  {
    id: "q_024",
    text: "Il segnale raffigurato indica la fine del diritto di precedenza.",
    answer: true,
    category: "segnali-precedenza",
    imageUrl: "https://www.patentati.it/foto/segnali-precedenza/fine-diritto-di-precedenza.gif",
    explanation: "Vero. Il rombo giallo con barra nera indica che la strada non gode più del diritto di precedenza."
  },
  {
    id: "q_025",
    text: "Il limite di tasso alcolemico per i neopatentati (primi 3 anni) è di 0,5 g/l.",
    answer: false,
    category: "alcool-droga-primo-soccorso",
    explanation: "Falso. Per i neopatentati (primi 3 anni) e per i conducenti professionali, il limite di tasso alcolemico è ZERO (0,0 g/l)."
  },
  {
    id: "q_026",
    text: "Il segnale raffigurato obbliga ad arrestarsi all'incrocio.",
    answer: true,
    category: "segnali-precedenza",
    imageUrl: "https://www.patentati.it/foto/segnali-precedenza/fermarsi-e-dare-precedenza.gif",
    explanation: "Vero. Il segnale di STOP obbliga a fermarsi sempre in corrispondenza della striscia di arresto e dare la precedenza a destra e a sinistra."
  },
  {
    id: "q_027",
    text: "L'aquaplaning si verifica più facilmente con pneumatici molto consumati.",
    answer: true,
    category: "elementi-veicolo-manutenzione-comportamenti",
    explanation: "Vero. Il battistrada consumato non riesce a smaltire l'acqua, facendo 'galleggiare' il pneumatico (aquaplaning) e causando la perdita di controllo."
  },
  {
    id: "q_028",
    text: "Il segnale raffigurato indica un senso unico alternato.",
    answer: false,
    category: "segnali-pericolo",
    imageUrl: "https://www.patentati.it/foto/segnali-pericolo/doppio-senso-di-circolazione.gif",
    explanation: "Falso. Il segnale triangolare con due frecce opposte preannuncia che una strada a senso unico diventa a doppio senso di circolazione."
  },
  {
    id: "q_029",
    text: "Il conducente che intende sorpassare deve accertarsi che la visibilità sia tale da consentire la manovra in sicurezza.",
    answer: true,
    category: "sorpasso",
    explanation: "Vero. Prima di iniziare un sorpasso, è obbligatorio verificare che ci sia spazio e visibilità sufficienti per completare la manovra senza creare pericoli."
  },
  {
    id: "q_030",
    text: "Il segnale raffigurato vieta la sosta nei giorni festivi.",
    answer: false,
    category: "segnali-divieto",
    imageUrl: "https://www.patentati.it/foto/segnali-divieto/divieto-di-sosta.gif",
    explanation: "Falso. Senza pannelli integrativi, nei centri abitati il divieto di sosta vale dalle 8:00 alle 20:00 di tutti i giorni. Fuori dai centri abitati vale 24 ore su 24."
  },
  {
    id: "q_031",
    text: "Il tram ha sempre la precedenza rispetto agli altri veicoli.",
    answer: false,
    category: "precedenza-incroci",
    explanation: "Falso. Il tram ha la precedenza, ma deve comunque rispettare i semafori, i segnali di STOP e le indicazioni dei vigili urbani. La parola 'sempre' rende l'affermazione falsa."
  },
  {
    id: "q_032",
    text: "È consentita la fermata ovunque non vi sia il segnale di divieto.",
    answer: false,
    category: "fermata-sosta-arresto",
    explanation: "Falso. La fermata è vietata in molti luoghi anche senza segnale (es. curve, dossi, incroci, passaggi a livello). La parola 'ovunque' rende l'affermazione falsa."
  },
  {
    id: "q_033",
    text: "In autostrada può essere ridotto il limite massimo di velocità in caso di nebbia.",
    answer: true,
    category: "limiti-di-velocita",
    explanation: "Vero. In caso di nebbia fitta con visibilità inferiore a 100m, il limite in autostrada può essere ridotto a 50 km/h tramite appositi segnali luminosi."
  },
  {
    id: "q_034",
    text: "La patente di guida viene revocata quando il titolare perda permanentemente i requisiti fisici ovvero psichici.",
    answer: true,
    category: "patente-punti-documenti",
    explanation: "Vero. La perdita permanente dei requisiti fisici o psichici (ovvero = oppure) comporta la revoca della patente."
  },
  {
    id: "q_035",
    text: "Il conducente deve fermarsi allorché il vigile disponga le braccia a croce.",
    answer: true,
    category: "semafori-vigili",
    explanation: "Vero. Le braccia a croce del vigile equivalgono alla luce rossa del semaforo per le correnti di traffico che incrociano la sua direzione."
  },
  {
    id: "q_036",
    text: "La spia di colore blu indica che sono accesi i proiettori abbaglianti.",
    answer: true,
    category: "luci-dispositivi-acustici",
    explanation: "Vero. La spia blu sul cruscotto è associata esclusivamente all'accensione dei fari abbaglianti."
  },
  {
    id: "q_037",
    text: "Il freno di stazionamento deve essere utilizzato durante la marcia per rallentare il veicolo.",
    answer: false,
    category: "elementi-veicolo-manutenzione-comportamenti",
    explanation: "Falso. Il freno di stazionamento (freno a mano) serve per bloccare il veicolo durante la sosta o in emergenza, non per rallentare durante la marcia normale (per cui si usa il freno di servizio)."
  },
  {
    id: "q_038",
    text: "La luce della targa posteriore deve essere sempre di colore bianco.",
    answer: true,
    category: "luci-dispositivi-acustici",
    explanation: "Vero. La luce che illumina la targa posteriore deve essere bianca per garantirne la leggibilità."
  },
  {
    id: "q_039",
    text: "Il segnale raffigurato indica una corsia riservata esclusivamente agli autobus.",
    answer: false,
    category: "segnali-indicazione",
    imageUrl: "https://www.patentati.it/foto/segnali-indicazione/fermata-autobus.gif",
    explanation: "Falso. Il segnale quadrato blu con l'autobus indica una fermata di autobus, non una corsia riservata."
  },
  {
    id: "q_040",
    text: "Non si deve mai sorpassare a destra.",
    answer: false,
    category: "sorpasso",
    explanation: "Falso. Il sorpasso a destra è consentito in casi specifici, ad esempio se il veicolo da sorpassare ha segnalato l'intenzione di svoltare a sinistra o in caso di marcia per file parallele."
  }
];

import { getRandomQuestions, getDB, getQuestionsByCategory as dbGetQuestionsByCategory } from '../lib/db';

export const getRandomExam = async (count: number = 30): Promise<Question[]> => {
  const db = await getDB();
  const allKeys = await db.getAllKeys('questions');
  
  if (allKeys.length === 0) {
    // Fallback to static database if IndexedDB is empty with proper distribution
    const questionsByCategory: Record<string, Question[]> = {};
    quizDatabase.forEach(q => {
      if (!questionsByCategory[q.category]) {
        questionsByCategory[q.category] = [];
      }
      questionsByCategory[q.category].push(q);
    });

    const selectedQuestions: Question[] = [];
    const categories = Object.keys(questionsByCategory);
    
    categories.forEach(cat => {
      questionsByCategory[cat].sort(() => 0.5 - Math.random());
    });

    const primaryCategories = [
      'segnali-pericolo',
      'segnali-divieto',
      'segnali-precedenza',
      'precedenza-incroci',
      'limiti-di-velocita'
    ];

    categories.forEach(cat => {
      if (selectedQuestions.length < count) {
        const q = questionsByCategory[cat].pop();
        if (q) selectedQuestions.push(q);
      }
    });

    let primaryIndex = 0;
    while (selectedQuestions.length < count && primaryCategories.length > 0) {
      const cat = primaryCategories[primaryIndex % primaryCategories.length];
      if (questionsByCategory[cat] && questionsByCategory[cat].length > 0) {
        const q = questionsByCategory[cat].pop();
        if (q) selectedQuestions.push(q);
        primaryIndex++;
      } else {
        primaryCategories.splice(primaryIndex % primaryCategories.length, 1);
      }
    }

    let anyIndex = 0;
    const remainingCategories = categories.filter(cat => questionsByCategory[cat].length > 0);
    while (selectedQuestions.length < count && remainingCategories.length > 0) {
      const cat = remainingCategories[anyIndex % remainingCategories.length];
      const q = questionsByCategory[cat].pop();
      if (q) {
        selectedQuestions.push(q);
        anyIndex++;
      } else {
        remainingCategories.splice(anyIndex % remainingCategories.length, 1);
      }
    }

    return selectedQuestions.sort(() => 0.5 - Math.random());
  }

  // If we have data in IndexedDB, use it
  const questions = await getRandomQuestions(count);
  return questions;
};

export const getExamByCategory = async (category: string, count: number = 20): Promise<Question[]> => {
  const db = await getDB();
  const allKeys = await db.getAllKeys('questions');

  if (allKeys.length === 0) {
    // Fallback
    const filtered = quizDatabase.filter(q => q.category === category);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const questions = await dbGetQuestionsByCategory(category);
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getExamFromWeaknesses = async (weaknessIds: string[], count: number = 20): Promise<Question[]> => {
  const db = await getDB();
  const allKeys = await db.getAllKeys('questions');

  if (allKeys.length === 0) {
    // Fallback
    const filtered = quizDatabase.filter(q => weaknessIds.includes(q.id));
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const questions: Question[] = [];
  const tx = db.transaction('questions', 'readonly');
  const store = tx.objectStore('questions');
  
  for (const id of weaknessIds) {
    const q = await store.get(id);
    if (q) questions.push(q);
  }

  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
