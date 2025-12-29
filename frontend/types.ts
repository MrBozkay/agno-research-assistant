
export interface ResearchSource {
  title: string;
  uri: string;
}

export interface ResearchResult {
  summary: string;
  sources: ResearchSource[];
}

export enum ResearchCategory {
  ARXIV = 'arxiv',
  GITHUB = 'github',
  MODELS = 'models',
  GENERAL = 'general'
}

export interface HistoryItem {
  id: string;
  query: string;
  category: ResearchCategory;
  result: ResearchResult;
  timestamp: number;
}
