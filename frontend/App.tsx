
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ResearchCard from './components/ResearchCard';
import LoadingOverlay from './components/LoadingOverlay';
import ResearchResultView from './components/ResearchResultView';
import HistoryDrawer from './components/HistoryDrawer';
import { conductResearch } from './services/geminiService';
import { ResearchResult, ResearchCategory, HistoryItem } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<ResearchCategory>(ResearchCategory.GENERAL);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('research_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage when updated
  useEffect(() => {
    localStorage.setItem('research_history', JSON.stringify(history));
  }, [history]);

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string, category?: ResearchCategory) => {
    if (e) e.preventDefault();
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    const usedCategory = category || activeCategory;
    
    try {
      const researchResult = await conductResearch(finalQuery, usedCategory);
      setResult(researchResult);
      
      // Save to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        query: finalQuery,
        category: usedCategory,
        result: researchResult,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 50)); 
    } catch (error) {
      alert("Araştırma sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (category: ResearchCategory) => {
    setActiveCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectItem = (item: HistoryItem) => {
    setResult(item.result);
    setQuery(item.query);
    setActiveCategory(item.category);
    setIsHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm("Tüm geçmişinizi silmek istediğinize emin misiniz?")) {
      setHistory([]);
    }
  };

  const clearResults = () => {
    setResult(null);
    setQuery('');
    setActiveCategory(ResearchCategory.GENERAL);
  };

  const handleSuggestionClick = (s: string) => {
    // Logic to "add" or replace in search bar as requested
    if (query.length > 0 && !query.includes(s)) {
      setQuery(prev => `${prev} ${s}`);
    } else {
      setQuery(s);
    }
  };

  const suggestions = [
    "Next-gen LLM Architectures",
    "Stable Diffusion Video",
    "Efficient LoRA",
    "Agent Frameworks"
  ];

  return (
    <Layout 
      onOpenHistory={() => setIsHistoryOpen(true)}
      historyCount={history.length}
    >
      {loading && <LoadingOverlay />}

      <HistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectItem={handleSelectItem}
        onDeleteItem={handleDeleteItem}
        onClearHistory={handleClearHistory}
      />

      {!result ? (
        <div className="flex flex-col items-center relative">
          {/* Large Hero Glow from Screenshot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square hero-glow -z-10 pointer-events-none opacity-60"></div>
          
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-bold tracking-widest uppercase mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              V2.5 LIVE • ADVANCED AI SEARCH
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 leading-[0.9] text-slate-900 dark:text-white opacity-90">
              <span className="text-gradient">Smarter</span><br />
              Research.
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Akademik yayınlar, GitHub repoları ve HuggingFace modelleri arasında köprü kurun. Yapay zeka ajanları sizin için tarasın ve özetlesin.
            </p>
          </div>

          <div className="w-full max-w-3xl mb-16 relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -inset-2 bg-primary/10 rounded-[32px] blur-xl opacity-50"></div>
            <div className="relative bg-white/70 dark:bg-card-dark/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl overflow-hidden p-2">
              <form onSubmit={handleSearch} className="flex items-center gap-2 p-1">
                <div className="flex-grow flex items-center px-4">
                  <span className="material-icons text-slate-400 text-2xl">search</span>
                  <input 
                    className="w-full px-4 py-4 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 text-lg outline-none font-medium" 
                    placeholder={activeCategory === ResearchCategory.GENERAL ? "Ne keşfetmek istersiniz?" : `${activeCategory} içinde ara...`}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-primary/25 font-bold flex items-center gap-2 shrink-0 group active:scale-95"
                >
                  <span>Araştır</span>
                  <span className="material-icons text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </form>
              
              {/* Integrated Suggestions - inside the search bar card as seen in screenshot */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center gap-2">
                {suggestions.map((s, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:border-primary/50 hover:text-primary dark:hover:text-primary transition-all active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <ResearchCard 
              icon="menu_book" 
              title="arXiv Sentezi" 
              description="Binlerce makale taranır, en güncel ve etkili olanlar sizin için seçilir."
              onClick={() => handleCardClick(ResearchCategory.ARXIV)}
            />
            <ResearchCard 
              icon="code" 
              title="Repo Analizi" 
              description="Implementasyon detayları ve en çok yıldızlanan GitHub projeleri listelenir."
              onClick={() => handleCardClick(ResearchCategory.GITHUB)}
            />
            <ResearchCard 
              icon="memory" 
              title="Model Keşfi" 
              description="HuggingFace üzerindeki SOTA modeller ve Spaces demoları anında raporlanır."
              onClick={() => handleCardClick(ResearchCategory.MODELS)}
            />
          </div>
        </div>
      ) : (
        <ResearchResultView result={result} onBack={clearResults} />
      )}
    </Layout>
  );
};

export default App;
