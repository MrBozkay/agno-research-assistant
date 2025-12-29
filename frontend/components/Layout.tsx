
import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onOpenHistory?: () => void;
  historyCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, onOpenHistory, historyCount = 0 }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[100px] -z-10"></div>
      </div>

      <header className="relative z-10 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.hash = ''}>
          <div className="relative w-8 h-8 flex items-center justify-center bg-white dark:bg-card-dark rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 group-hover:border-primary/50 transition-colors">
            <span className="material-icons text-primary text-xl">auto_awesome</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            Agno<span className="text-slate-400 dark:text-slate-500">.Tech</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onOpenHistory && (
            <button 
              className="relative p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
              onClick={onOpenHistory}
              title="Araştırma Geçmişi"
            >
              <span className="material-icons text-slate-600 dark:text-slate-400 text-lg">history</span>
              {historyCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              )}
            </button>
          )}
          <button 
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            onClick={toggleTheme}
            title="Temayı Değiştir"
          >
            <span className="material-icons text-slate-600 dark:text-slate-400 text-lg">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-12">
        {children}
      </main>

      <footer className="relative z-10 py-6 text-center text-xs text-slate-500 dark:text-slate-600 border-t border-slate-200 dark:border-slate-800/50">
        <p>© 2025 AGNO TECHNOLOGIES • BEYOND INFORMATION</p>
      </footer>
    </div>
  );
};

export default Layout;
