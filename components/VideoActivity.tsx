import React, { useState } from 'react';
import { ArrowLeft, Download, Copy, Check, FileText, MonitorPlay, ExternalLink } from 'lucide-react';

interface VideoActivityProps {
  onBack: () => void;
}

export const VideoActivity: React.FC<VideoActivityProps> = ({ onBack }) => {
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([notes], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "Hypertrophy_Video_Notes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      
      {/* Main Content Column (Video) */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
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
            <MonitorPlay size={16} className="text-red-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Video Analysis</h2>
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center bg-black/5 dark:bg-black/20">
          <div className="w-full max-w-5xl">
            <div className="aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative group">
              {/* YouTube Embed */}
              <iframe 
                src="https://www.youtube.com/embed/Uz4ZrvFY6b4" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
            
            {/* Fallback Message for Error 153 */}
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3 max-w-2xl mx-auto">
               <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-full text-amber-600 dark:text-amber-400 flex-shrink-0">
                 <MonitorPlay size={18} />
               </div>
               <div>
                 <h4 className="text-sm font-bold text-slate-900 dark:text-white">Video Not Playing?</h4>
                 <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 mb-2 leading-relaxed">
                   If you see "Error 153" or "Video unavailable", the content owner has restricted playback on external websites. You can watch it directly on YouTube.
                 </p>
                 <a 
                   href="https://www.youtube.com/watch?v=Uz4ZrvFY6b4" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline"
                 >
                   Open in YouTube <ExternalLink size={12} />
                 </a>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Column (Notes) */}
      <div className="lg:w-[450px] flex-shrink-0 flex flex-col h-[50vh] lg:h-full border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 shadow-xl z-10">
        
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-indigo-600 dark:text-indigo-400" size={20} />
            <h3 className="font-bold text-slate-900 dark:text-white">Observation Notes</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Document the key takeaways from the video that you find interesting or critical to your understanding.
          </p>
        </div>

        <div className="flex-1 p-4 bg-white dark:bg-slate-900">
          <textarea
            className="w-full h-full resize-none p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-200 placeholder-slate-400 leading-relaxed font-mono text-sm"
            placeholder={`Key Takeaways:\n\n1. \n\n2. \n\n3. `}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
           <div className="text-xs text-slate-500 dark:text-slate-400 text-center mb-2">
             When finished, copy or download your notes to upload to your personal Padlet.
           </div>
           <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-xl text-slate-700 dark:text-slate-200 font-medium transition-colors shadow-sm"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-md shadow-indigo-500/20"
            >
              <Download size={18} />
              Save File
            </button>
           </div>
        </div>

      </div>
    </div>
  );
};