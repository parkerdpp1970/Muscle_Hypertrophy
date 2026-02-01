import React, { useState, useEffect } from 'react';
import { PresentationView } from './components/PresentationView';
import { IntroPage } from './components/IntroPage';
import { FlashcardActivity } from './components/FlashcardActivity';
import { QuizActivity } from './components/QuizActivity';
import { VideoActivity } from './components/VideoActivity';
import { SimulatorActivity } from './components/SimulatorActivity';
import { TempoActivity } from './components/TempoActivity';
import { ProgramActivity } from './components/ProgramActivity';
import { Dumbbell, Sun, Moon } from 'lucide-react';

type View = 'intro' | 'presentation' | 'advanced-presentation' | 'flashcards' | 'quiz' | 'video' | 'simulator' | 'tempo' | 'program' | 'advanced-program';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('intro');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'presentation':
        return <PresentationView onBack={() => setCurrentView('intro')} />;
      case 'advanced-presentation':
        return (
          <PresentationView 
            onBack={() => setCurrentView('intro')} 
            embedUrl="https://advanced-resistance-trai-9v5dvd7.gamma.site/"
            title="Advanced Resistance Training"
          />
        );
      case 'flashcards':
        return <FlashcardActivity onBack={() => setCurrentView('intro')} />;
      case 'quiz':
        return <QuizActivity onBack={() => setCurrentView('intro')} />;
      case 'video':
        return <VideoActivity onBack={() => setCurrentView('intro')} />;
      case 'simulator':
        return <SimulatorActivity onBack={() => setCurrentView('intro')} />;
      case 'tempo':
        return <TempoActivity onBack={() => setCurrentView('intro')} />;
      case 'program':
        return <ProgramActivity onBack={() => setCurrentView('intro')} />;
      case 'advanced-program':
        return (
          <ProgramActivity 
            onBack={() => setCurrentView('intro')} 
            title="Advanced Programme Design"
            instructions="Apply advanced training systems such as drop sets, rest-pause, and cluster sets to your programme design. Use the template below to structure a high-intensity mesocycle."
          />
        );
      default:
        return (
          <IntroPage 
            onStartPresentation={() => setCurrentView('presentation')}
            onStartFlashcards={() => setCurrentView('flashcards')}
            onStartQuiz={() => setCurrentView('quiz')}
            onStartVideo={() => setCurrentView('video')}
            onStartSimulator={() => setCurrentView('simulator')}
            onStartTempo={() => setCurrentView('tempo')}
            onStartProgram={() => setCurrentView('program')}
            onStartAdvancedPresentation={() => setCurrentView('advanced-presentation')}
            onStartAdvancedProgram={() => setCurrentView('advanced-program')}
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] overflow-hidden transition-colors duration-300">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 z-50 transition-colors duration-300">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setCurrentView('intro')}
          >
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Hypertrophy<span className="text-slate-700 dark:text-slate-100">Hub</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Full Height Layout */}
      <main className="flex-grow w-full h-full overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;