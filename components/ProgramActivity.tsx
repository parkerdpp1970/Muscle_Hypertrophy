import React from 'react';
import { ArrowLeft, ExternalLink, FileText, Download } from 'lucide-react';

interface ProgramActivityProps {
  onBack: () => void;
  title?: string;
  instructions?: string;
}

export const ProgramActivity: React.FC<ProgramActivityProps> = ({ 
  onBack,
  title = "Programme Design Template",
  instructions = "This template guides you through designing a hypertrophy-focused mesocycle. You can fill it out directly below, or open it in a new window to save your changes to your DocHub account."
}) => {
  // Using the standard shared document URL which typically renders better on desktop/embeds
  const docUrl = "https://dochub.com/shared-document/betterfit/EB5r38AwlmxNA2dRXzZ1kD/hypertrophy-pd-template-pdf?dt=85G2R2eJLafmPmrNAK2C";

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      
      {/* Header */}
      <div className="flex-none flex items-center gap-4 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
        >
          <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span>Back</span>
        </button>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-teal-600 dark:text-teal-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        <div className="ml-auto">
            <a 
              href={docUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Open in DocHub <ExternalLink size={12} />
            </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-100 dark:bg-slate-900/50 relative">
        <div className="absolute inset-0 p-4 md:p-8 flex flex-col items-center">
             
             {/* Instructions Banner */}
             <div className="w-full max-w-5xl mb-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                        <FileText size={20} className="text-teal-500" /> 
                        {title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {instructions}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <a 
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-teal-500/20"
                    >
                        <ExternalLink size={16} /> Open in DocHub
                    </a>
                </div>
             </div>

             {/* Iframe Container */}
             <div className="w-full max-w-5xl flex-1 bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
                <iframe 
                    src={docUrl}
                    className="w-full h-full border-0"
                    title="DocHub Template"
                    allow="clipboard-read; clipboard-write"
                />
             </div>
        </div>
      </div>
    </div>
  );
};