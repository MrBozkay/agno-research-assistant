
import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-icons text-primary text-3xl animate-pulse">auto_awesome</span>
        </div>
      </div>
      <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Sentezleniyor...</h2>
      <p className="text-slate-600 dark:text-slate-400 animate-pulse text-sm">
        Yapay zeka ajanları kaynakları tarıyor ve özetliyor.
      </p>
    </div>
  );
};

export default LoadingOverlay;
