
import React from 'react';
import { HistoryItem, ResearchCategory } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelectItem, 
  onDeleteItem,
  onClearHistory 
}) => {
  const getIcon = (category: ResearchCategory) => {
    switch (category) {
      case ResearchCategory.ARXIV: return 'menu_book';
      case ResearchCategory.GITHUB: return 'code';
      case ResearchCategory.MODELS: return 'memory';
      default: return 'search';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    }).format(timestamp);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-card-dark z-[70] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col border-l border-slate-200 dark:border-slate-800 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-icons text-primary">history</span>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Geçmiş</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <span className="material-icons text-slate-500">close</span>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <span className="material-icons text-slate-300 dark:text-slate-700 text-6xl mb-4">history_toggle_off</span>
              <p className="text-slate-500 dark:text-slate-400">Henüz bir araştırma geçmişiniz bulunmuyor.</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                className="group relative bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
                onClick={() => onSelectItem(item)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 bg-white dark:bg-card-dark rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                    <span className="material-icons text-primary text-xl">{getIcon(item.category)}</span>
                  </div>
                  <div className="flex-grow min-w-0 pr-8">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.query}</h4>
                    <p className="text-xs text-slate-500 mt-1">{formatDate(item.timestamp)}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  className="absolute top-4 right-4 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <span className="material-icons text-sm">delete</span>
                </button>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={onClearHistory}
              className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
            >
              Tüm Geçmişi Temizle
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default HistoryDrawer;
