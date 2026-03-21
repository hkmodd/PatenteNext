export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'CRITICAL';

export interface TrickQuestion {
  question: string;
  isTrue: boolean;
  explanation: string;
}

export interface TheoryImage {
  url: string;
  caption: string;
}

export interface TheorySection {
  id: string;
  subtitle: string;
  paragraphs: string[];
  alerts?: string[];
  images?: TheoryImage[];
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


