
import React from 'react';

interface ResearchCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

const ResearchCard: React.FC<ResearchCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <div 
      className="group relative bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-[24px] p-8 hover:shadow-glow hover:-translate-y-2 transition-all duration-500 cursor-pointer text-center"
      onClick={onClick}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center shadow-soft z-10 transition-transform group-hover:scale-110 group-hover:border-primary/50">
        <span className="material-icons text-primary text-2xl">{icon}</span>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 px-2">
          {description}
        </p>
        <div className="inline-flex items-center text-sm font-bold text-primary group-hover:underline decoration-2 underline-offset-4 transition-all">
          Keşfet <span className="material-icons text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </div>
      </div>
    </div>
  );
};

export default ResearchCard;
