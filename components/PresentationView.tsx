import React from 'react';
import { EmbedViewer } from './EmbedViewer';
import { AICoach } from './AICoach';
import { ArrowLeft, MonitorPlay } from 'lucide-react';

interface PresentationViewProps {
  onBack: () => void;
  embedUrl?: string;
  title?: string;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ 
  onBack, 
  embedUrl,
  title = "Science of Muscle Hypertrophy"
}) => {
  return (
    <div className="flex flex-col lg:flex-row h-full">
      
      {/* Left Column: Presentation (Flexes to fill space) */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-black transition-colors duration-300">
        
        {/* Navigation Bar */}
        <div className="flex-none flex items-center gap-4 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
          >
            <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
          
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 overflow-hidden">
            <MonitorPlay size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <h2 className="text-sm font-semibold truncate">{title}</h2>
          </div>
        </div>

        {/* The Main Embed - Expands to fill available vertical space */}
        <div className="flex-1 min-h-0 relative bg-slate-100 dark:bg-slate-900/50">
          <EmbedViewer src={embedUrl} />
        </div>
        
        {/* Quick Stats bar at the bottom of the presentation panel */}
        <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 transition-colors duration-300">
           <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Duration</h3>
              <p className="text-slate-900 dark:text-slate-200 text-sm font-medium">15 Mins</p>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Level</h3>
              <p className="text-slate-900 dark:text-slate-200 text-sm font-medium">Intermediate</p>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Topic</h3>
              <p className="text-slate-900 dark:text-slate-200 text-sm font-medium">Physiology</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: AI Coach (Fixed width on large screens) */}
      <div className="lg:w-[400px] xl:w-[450px] flex-shrink-0 h-[50vh] lg:h-full border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300">
        <AICoach />
      </div>

    </div>
  );
};