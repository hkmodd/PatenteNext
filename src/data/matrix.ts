export interface MatrixRule {
  id: string;
  keyword: string;
  probabilityTrue: number;
  explanation: string;
  examples: { text: string; isTrue: boolean }[];
}

export const matrixRules: MatrixRule[] = [
  {
    id: 'sempre',
    keyword: 'Sempre',
    probabilityTrue: 10,
    explanation: 'Le affermazioni assolute sono quasi sempre false nel codice della strada, perché esistono quasi sempre eccezioni (es. veicoli di emergenza, indicazioni dei vigili).',
    examples: [
      { text: 'Il tram ha sempre la precedenza.', isTrue: false },
      { text: 'Il sorpasso è sempre vietato in curva.', isTrue: false }
    ]
  },
  {
    id: 'mai',
    keyword: 'Mai',
    probabilityTrue: 15,
    explanation: 'Come "sempre", anche "mai" indica un\'assolutezza che raramente trova riscontro senza eccezioni.',
    examples: [
      { text: 'Non si deve mai sorpassare a destra.', isTrue: false }
    ]
  },
  {
    id: 'esclusivamente',
    keyword: 'Esclusivamente / Solamente',
    probabilityTrue: 5,
    explanation: 'Restringe troppo il campo. Spesso ci sono altre condizioni o soggetti coinvolti.',
    examples: [
      { text: 'La corsia di emergenza è destinata esclusivamente alla sosta dei veicoli in avaria.', isTrue: false }
    ]
  },
  {
    id: 'ovunque',
    keyword: 'Ovunque / In qualsiasi caso',
    probabilityTrue: 0,
    explanation: 'Non esiste una regola che valga letteralmente "ovunque" senza limitazioni di spazio o contesto.',
    examples: [
      { text: 'È consentita la fermata ovunque non vi sia il segnale di divieto.', isTrue: false }
    ]
  },
  {
    id: 'puo',
    keyword: 'Può / È consentito',
    probabilityTrue: 85,
    explanation: 'I termini possibilisti sono spesso veri perché ammettono la casistica prevista dal codice.',
    examples: [
      { text: 'In autostrada può essere ridotto il limite massimo di velocità in caso di nebbia.', isTrue: true }
    ]
  },
  {
    id: 'deve',
    keyword: 'Deve / È obbligatorio',
    probabilityTrue: 70,
    explanation: 'I doveri e gli obblighi sono il cuore del codice della strada. Spesso le frasi che descrivono un comportamento prudenziale obbligatorio sono vere.',
    examples: [
      { text: 'Il conducente deve regolare la velocità in relazione alle caratteristiche del veicolo.', isTrue: true }
    ]
  },
  {
    id: 'ovvero',
    keyword: 'Ovvero',
    probabilityTrue: 95,
    explanation: 'Nel linguaggio giuridico del Codice della Strada, "ovvero" significa "oppure" (disgiuntiva), non "cioè". Le frasi che lo contengono sono quasi sempre vere perché elencano alternative valide.',
    examples: [
      { text: 'La patente di guida viene revocata quando il titolare perda permanentemente i requisiti fisici ovvero psichici.', isTrue: true }
    ]
  },
  {
    id: 'allorche',
    keyword: 'Allorché',
    probabilityTrue: 100,
    explanation: 'Termine desueto che significa "quando" o "nel momento in cui". Statisticamente, tutte le domande del database che contengono "allorché" sono VERE.',
    examples: [
      { text: 'Il conducente deve fermarsi allorché il vigile disponga le braccia a croce.', isTrue: true }
    ]
  }
];

export const wordAssociations = [
  {
    words: ['Freno a mano', 'Freno di stazionamento'],
    association: 'Sosta / Emergenza',
    isTrue: true
  },
  {
    words: ['Freno di servizio'],
    association: 'Pedale del freno',
    isTrue: true
  },
  {
    words: ['Luce targa'],
    association: 'Sempre bianca',
    isTrue: true
  },
  {
    words: ['Spia blu'],
    association: 'Solo abbaglianti',
    isTrue: true
  },
  {
    words: ['Spia verde'],
    association: 'Indicatori di direzione / Posizione / Anabbaglianti / Fendinebbia anteriori',
    isTrue: true
  },
  {
    words: ['Spia rossa'],
    association: 'Pericolo / Emergenza / Freno a mano / Olio / Batteria / Temperatura Acqua',
    isTrue: true
  },
  {
    words: ['Spia ambra/gialla'],
    association: 'Avvertimento / Riserva carburante / Retronebbia / Sbrinatore',
    isTrue: true
  },
  {
    words: ['Aquaplaning'],
    association: 'Galleggiamento / Asfalto bagnato / Pneumatici consumati / Velocità elevata',
    isTrue: true
  },
  {
    words: ['Sospensione patente'],
    association: 'Eccesso di velocità (>40km/h) / Guida in stato di ebbrezza / Fuga dopo incidente',
    isTrue: true
  },
  {
    words: ['Revoca patente'],
    association: 'Perdita permanente requisiti / Guida contromano in autostrada',
    isTrue: true
  }
];
