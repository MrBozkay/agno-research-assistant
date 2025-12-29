
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ResearchResult } from '../types';

interface ResearchResultViewProps {
  result: ResearchResult;
  onBack: () => void;
}

const ResearchResultView: React.FC<ResearchResultViewProps> = ({ result, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group"
      >
        <span className="material-icons text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Geri Dön
      </button>

      <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-icons text-primary">auto_awesome</span>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Araştırma Özeti</h2>
        </div>
        
        <div className="prose dark:prose-invert prose-slate max-w-none">
          <ReactMarkdown>{result.summary}</ReactMarkdown>
        </div>
      </div>

      {result.sources.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white px-2">Referanslar & Kaynaklar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-primary/50 transition-all group"
              >
                <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-primary text-xl">link</span>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{source.title}</h4>
                  <p className="text-xs text-slate-500 truncate">{source.uri}</p>
                </div>
                <span className="material-icons text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchResultView;
