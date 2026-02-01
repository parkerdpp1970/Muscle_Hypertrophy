import React, { useState } from 'react';
import { Search, Presentation, ArrowRight, ExternalLink, Layers, GraduationCap, RefreshCw, Copy, Check, MonitorPlay, BookOpen, X, Lightbulb, Play, FileText, Sparkles, Timer, Activity, ClipboardList } from 'lucide-react';
import { generateResearchPrompt } from '../services/gemini';

interface IntroPageProps {
  onStartPresentation: () => void;
  onStartFlashcards: () => void;
  onStartQuiz: () => void;
  onStartVideo: () => void;
  onStartSimulator: () => void;
  onStartTempo: () => void;
  onStartProgram: () => void;
  onStartAdvancedPresentation: () => void;
  onStartAdvancedProgram: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ 
  onStartPresentation, 
  onStartFlashcards, 
  onStartQuiz, 
  onStartVideo, 
  onStartSimulator, 
  onStartTempo, 
  onStartProgram,
  onStartAdvancedPresentation,
  onStartAdvancedProgram
}) => {
  const [researchPrompt, setResearchPrompt] = useState("mechanical tension vs metabolic stress hypertrophy");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Modals state
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activePromptCopy, setActivePromptCopy] = useState<number | null>(null);

  const recommendedPrompts = [
    {
      title: 'The "Training to Failure" Debate',
      desc: 'This is currently one of the hottest topics. Do you actually need to fail a lift to grow, or is getting close enough?',
      query: 'Is training to momentary muscular failure necessary for maximizing hypertrophy compared to leaving reps in reserve?'
    },
    {
      title: 'The "Lengthened Partials" Controversy',
      desc: 'Recent research suggests that full range of motion (ROM) might not always be king, specifically regarding the "stretched" position of the muscle.',
      query: 'Do lengthened partial repetitions result in greater muscle hypertrophy compared to full range of motion?'
    },
    {
      title: 'Volume vs. Frequency (The "Bro-Split" Question)',
      desc: 'This prompt helps settle whether hitting a muscle once a week with a ton of sets is better or worse than hitting it 2-3 times with fewer sets per session.',
      query: 'Does high frequency training produce more hypertrophy than low frequency training when weekly volume is equated?'
    },
    {
      title: 'The "Light Weight vs. Heavy Weight" Debate',
      desc: 'Many people still believe you must lift heavy (1-5 reps) to grow. This prompt looks for evidence regarding low-load training (high reps).',
      query: 'Is low load resistance training as effective as high load training for muscle hypertrophy when performed to failure?'
    },
    {
      title: 'Rest Periods (Metabolic Stress vs. Mechanical Tension)',
      desc: 'Old school bodybuilding advice says "short rests for growth," but modern mechanical tension theories suggest longer rests might be better.',
      query: 'What is the effect of short versus long inter-set rest intervals on muscle hypertrophy mechanisms?'
    },
    {
      title: 'The "Volume Ceiling" (Junk Volume)',
      desc: 'Is more always better? This prompt searches for the "inverted U" curve—the point where doing more sets actually stops giving you gains.',
      query: 'Is there a dose-response relationship between weekly set volume and muscle hypertrophy, and does a limit exist?'
    },
    {
      title: 'Stretch-Mediated Hypertrophy (Bonus)',
      desc: 'This is a specific mechanism often discussed regarding exercises like overhead extensions or RDLs.',
      query: 'Does loaded inter-set stretching or training at long muscle lengths enhance muscle hypertrophy?'
    }
  ];

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    const newPrompt = await generateResearchPrompt();
    setResearchPrompt(newPrompt);
    setIsGenerating(false);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(researchPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setActivePromptCopy(index);
    setTimeout(() => setActivePromptCopy(null), 2000);
  };

  return (
    <div className="flex-grow w-full h-full overflow-y-auto bg-slate-50 dark:bg-[#0f172a] p-4 sm:p-8 custom-scrollbar transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-8 md:py-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Science of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Hypertrophy</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Learning pathway aim is to develop knowledge of the muscle hypertrophy mechanisms to be able to design muscle hypertrophy training programmes.
          </p>
        </div>

        {/* Learning Path Grid */}
        <div className="grid md:grid-cols-2 gap-8 pb-20">
          
          {/* Activity 1: Video Analysis */}
          <div className="group flex flex-col relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-8 hover:border-red-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-red-500/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <MonitorPlay size={120} className="text-red-600 dark:text-red-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20">
                <MonitorPlay className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-lg font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Activity 01</span>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Video Analysis</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Watch the educational video on muscle hypertrophy. Please document five key points that you find interesting or critical to your understanding in your personal Padlet.
            </p>

            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700/50">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Instructions:</h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5">
                <li>Watch the video in its entirety.</li>
                <li>Identify 5 key takeaways.</li>
                <li>Write your notes up in your personal Padlet.</li>
              </ul>
            </div>
            
            <div className="mt-auto">
              <a 
                href="https://youtu.be/AYk2x9iRKn0?si=PqX_wCp7cVCbyQRM"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 text-white bg-red-600 hover:bg-red-500 px-6 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/20"
              >
                Start Video Analysis <ExternalLink size={18} />
              </a>
            </div>
          </div>

          {/* Activity 2: Flashcards */}
          <div className="group flex flex-col relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-8 hover:border-pink-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-pink-500/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Layers size={120} className="text-pink-600 dark:text-pink-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-50 dark:bg-pink-500/10 rounded-2xl border border-pink-100 dark:border-pink-500/20">
                <Layers className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <span className="text-lg font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">Activity 02</span>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Retention Deck</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Reinforce your knowledge with AI-generated flashcards covering key terms like mechanical tension, metabolic stress, and progressive overload.
            </p>
            
            <div className="mt-auto">
              <button 
                onClick={onStartFlashcards}
                className="w-full inline-flex items-center justify-center gap-2 text-white bg-pink-600 hover:bg-pink-500 px-6 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-pink-500/20"
              >
                Open Flashcards <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Activity 3: Research & Synthesis */}
          <div className="group flex flex-col relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-8 hover:border-indigo-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Search size={120} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Activity 03</span>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Research & Synthesis</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-sm">
              Gather evidence on hypertrophy mechanisms and synthesise your findings into visual notes.
            </p>

            {/* Split Tasks Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* Part 1: Research */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 flex flex-col h-full">
                 <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm flex items-center gap-2">
                   <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">1</div>
                   Research Phase
                 </h4>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex-grow">
                   The aim is to research a muscle hypertrophy topic using Consensus.app. Use the topic generator or copy a prompt and paste in Consensus.
                 </p>
                 <div className="space-y-2">
                   <button 
                     onClick={() => setShowResearchModal(true)}
                     className="w-full text-xs font-medium flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                   >
                     <BookOpen size={14} /> Topic Generator
                   </button>
                   <a 
                     href="https://consensus.app/"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-full text-xs font-bold flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition-colors"
                   >
                     Launch Consensus <ExternalLink size={12} />
                   </a>
                 </div>
              </div>

              {/* Part 2: Synthesis */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 flex flex-col h-full">
                 <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm flex items-center gap-2">
                   <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">2</div>
                   Infographic
                 </h4>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex-grow">
                   Create an infographic summary of your findings using NotebookLM. Follow the video instructions by clicking 'Watch Tutorial'.
                 </p>
                 <div className="space-y-2">
                    <button 
                      onClick={() => setShowVideoModal(true)}
                      className="w-full text-xs font-medium flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Play size={14} /> Watch Tutorial
                    </button>
                    <a 
                      href="https://notebooklm.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-xs font-bold flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 py-2 rounded-lg border-2 border-indigo-600/20 hover:border-indigo-600/40 transition-colors"
                    >
                      Open NotebookLM <ExternalLink size={12} />
                    </a>
                 </div>
              </div>
            </div>
          </div>

          {/* Activity 4: Core Lesson */}
          <div className="group flex flex-col relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-8 hover:border-purple-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Presentation size={120} className="text-purple-600 dark:text-purple-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl border border-purple-100 dark:border-purple-500/20">
                <Presentation className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-lg font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Activity 04</span>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Core Lesson</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Access the "Science of Muscle Hypertrophy" presentation. Use the integrated AI Coach to clarify complex physiological mechanisms in real-time.
            </p>
            
             <div className="mt-auto bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700/50">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400"></span>
                Key Objectives
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">Mechanotransduction</span>
                <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">Volume</span>
              </div>
            </div>
            
            <button 
              onClick={onStartPresentation}
              className="w-full inline-flex items-center justify-center gap-2 text-white bg-purple-600 hover:bg-purple-500 px-6 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20"
            >
              Start Interactive Presentation <ArrowRight size={18} />
            </button>
          </div>

          {/* Activity 5: Session Design */}
          <div className="group flex flex-col relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-8 hover:border-blue-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Timer size={120} className="text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                <Timer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-lg font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Activity 05</span>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Session Design</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Plan training variables for a single session. Explore how changing volume, tempo, and rest intervals affects total workout time to meet specific efficiency challenges.
            </p>
            
            <div className="mt-auto">
              <button 
                onClick={onStartSimulator}
                className="w-full inline-flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-500 px-6 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
              >
                Launch Simulator <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Activity 6: Movement Tempo */}
          <div className="group flex flex-col relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-8 hover:border-cyan-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity size={120} className="text-cyan-600 dark:text-cyan-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-50 dark:bg-cyan-500/10 rounded-2xl border border-cyan-100 dark:border-cyan-500/20">
                <Activity className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="text-lg font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Activity 06</span>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Movement Tempo</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
               Understand how movement speed affects training outcomes. Use the real-time tempo simulator to visualize eccentric and concentric phases and analyze their impact on hypertrophy vs. strength.
            </p>
            
            <div className="mt-auto">
              <button 
                onClick={onStartTempo}
                className="w-full inline-flex items-center justify-center gap-2 text-white bg-cyan-600 hover:bg-cyan-500 px-6 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/20"
              >
                Launch Tempo Explorer <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Activity 7: Program Design */}
          <div className="group flex flex-col relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-8 hover:border-teal-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-teal-500/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ClipboardList size={120} className="text-teal-600 dark:text-teal-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-teal-50 dark:bg-teal-500/10 rounded-2xl border border-teal-100 dark:border-teal-500/20">
                <ClipboardList className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-lg font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Activity 07</span>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Programme Design</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
               Apply your knowledge of hypertrophy principles to create a comprehensive training programme. Use the provided template to structure volume, intensity, and frequency.
            </p>
            
            <div className="mt-auto">
              <a 
                href="https://dochub.com/m/shared-document/betterfit/EB5r38AwlmxNA2dRXzZ1kD/hypertrophy-pd-template-pdf?dt=85G2R2eJLafmPmrNAK2C"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 text-white bg-teal-600 hover:bg-teal-500 px-6 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-teal-500/20"
              >
                Open Programme Template <ExternalLink size={18} />
              </a>
            </div>
          </div>

          {/* Activity 8: Knowledge Check */}
          <div className="group flex flex-col relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-8 hover:border-emerald-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <GraduationCap size={120} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-lg font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Activity 08</span>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Knowledge Check</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Test your understanding with complex multiple-choice scenarios. Receive instant, detailed feedback on why answers are correct or incorrect.
            </p>
            
            <div className="mt-auto">
              <button 
                onClick={onStartQuiz}
                className="w-full inline-flex items-center justify-center gap-2 text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
              >
                Start Quiz <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Activity 9: Core Lesson II (New) */}
          <div className="group flex flex-col relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-8 hover:border-orange-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-orange-500/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Presentation size={120} className="text-orange-600 dark:text-orange-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-2xl border border-orange-100 dark:border-orange-500/20">
                <Presentation className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-lg font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Activity 09</span>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Core Lesson</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Explore advanced resistance training concepts including drop sets, rest-pause, and occlusion training methodologies.
            </p>
            
            <div className="mt-auto">
              <button 
                onClick={onStartAdvancedPresentation}
                className="w-full inline-flex items-center justify-center gap-2 text-white bg-orange-600 hover:bg-orange-500 px-6 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20"
              >
                Advanced Training Systems <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Activity 10: Advanced Program Design (New) */}
          <div className="group flex flex-col relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-8 hover:border-rose-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-rose-500/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ClipboardList size={120} className="text-rose-600 dark:text-rose-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20">
                <ClipboardList className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <span className="text-lg font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Activity 10</span>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Advanced Programme</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
               Apply advanced training systems such as drop sets, rest-pause, and cluster sets to your programme design. Use the template to structure a high-intensity mesocycle.
            </p>
            
            <div className="mt-auto">
              <a 
                href="https://dochub.com/m/shared-document/betterfit/EB5r38AwlmxNA2dRXzZ1kD/hypertrophy-pd-template-pdf?dt=85G2R2eJLafmPmrNAK2C"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 text-white bg-rose-600 hover:bg-rose-500 px-6 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-500/20"
              >
                Advanced Design Template <ExternalLink size={18} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Unified Research Tools Modal */}
      {showResearchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowResearchModal(false)} />
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex-none flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                   <BookOpen className="text-indigo-600 dark:text-indigo-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Research Tools</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Prompts & Utilities for Consensus.app</p>
                </div>
              </div>
              <button 
                onClick={() => setShowResearchModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-50 dark:bg-slate-950/30">
               
               {/* Section 1: AI Generator */}
               <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                      <Sparkles size={18} /> AI Prompt Generator
                    </h3>
                    <button 
                      onClick={handleGeneratePrompt}
                      disabled={isGenerating}
                      className="text-xs flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={12} className={isGenerating ? "animate-spin" : ""} />
                      Generate New
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-500/30 shadow-sm">
                     <p className="flex-grow text-sm text-slate-700 dark:text-slate-200 font-medium font-mono">
                       "{researchPrompt}"
                     </p>
                     <button 
                       onClick={copyToClipboard}
                       className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors"
                       title="Copy to clipboard"
                     >
                       {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                     </button>
                  </div>
               </div>

               {/* Section 2: Library */}
               <div>
                 <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                   <FileText size={18} /> Curated Prompt Library
                 </h3>
                 <div className="grid gap-4">
                   {recommendedPrompts.map((prompt, i) => (
                     <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                       <div className="mb-3">
                          <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                            {prompt.title}
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                            {prompt.desc}
                          </p>
                       </div>
                       <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
                          <p className="flex-grow font-mono text-xs text-slate-700 dark:text-slate-300 italic truncate">
                            "{prompt.query}"
                          </p>
                          <button 
                            onClick={() => handleCopyPrompt(prompt.query, i)}
                            className={`flex-shrink-0 p-1.5 rounded-md transition-all duration-200 ${
                              activePromptCopy === i 
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
                            }`}
                            title="Copy prompt"
                          >
                            {activePromptCopy === i ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl">
               <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-3">
                 <Lightbulb className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={16} />
                 <p className="text-xs text-amber-900 dark:text-amber-100 leading-relaxed">
                   <strong>Pro Tip:</strong> Look for "Volume Equated" in search results. Meta-analyses are generally more reliable than single studies.
                 </p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* NotebookLM Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowVideoModal(false)} />
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border border-slate-800 animate-in zoom-in-95 duration-200">
             <button 
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
              >
                <X size={24} />
              </button>
             <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/SjpI1U9E4I8?autoplay=1" 
                title="NotebookLM Tutorial" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};