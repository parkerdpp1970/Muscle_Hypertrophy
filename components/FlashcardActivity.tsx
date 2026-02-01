import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, ChevronLeft, ChevronRight, BrainCircuit } from 'lucide-react';
import { Flashcard } from '../types';
import { generateFlashcards } from '../services/gemini';

interface FlashcardActivityProps {
  onBack: () => void;
}

export const FlashcardActivity: React.FC<FlashcardActivityProps> = ({ onBack }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCards = async () => {
    setIsLoading(true);
    const data = await generateFlashcards();
    setCards(data);
    setIsLoading(false);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
    }
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      {/* Header */}
      <div className="flex-none flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800">
            <ArrowLeft size={16} />
          </div>
          Back
        </button>
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-indigo-600 dark:text-indigo-400" size={20} />
          <h2 className="font-bold text-slate-900 dark:text-white">Flashcards</h2>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {isLoading ? (
          <div className="text-center space-y-4">
            <RefreshCw className="animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" size={40} />
            <p className="text-slate-600 dark:text-slate-400">Generating study deck...</p>
          </div>
        ) : cards.length > 0 ? (
          <div className="w-full max-w-2xl perspective-1000">
            {/* Progress */}
            <div className="text-center mb-6 text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
              Card {currentIndex + 1} of {cards.length}
            </div>

            {/* Card Container */}
            <div 
              className="relative w-full aspect-[3/2] cursor-pointer group perspective-1000"
              onClick={toggleFlip}
            >
              <div 
                className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* Front */}
                <div 
                  className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 md:p-12 backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">Term</span>
                  <h3 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white text-center">
                    {cards[currentIndex].term}
                  </h3>
                  <p className="absolute bottom-6 text-xs text-slate-400">Click to flip</p>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 w-full h-full bg-indigo-600 dark:bg-indigo-900 rounded-3xl shadow-xl border border-indigo-500 flex flex-col items-center justify-center p-8 md:p-12 backface-hidden rotate-y-180"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-4">Definition</span>
                  <p className="text-lg md:text-xl text-white text-center leading-relaxed font-medium">
                    {cards[currentIndex].definition}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                disabled={currentIndex === 0}
                className="p-4 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); fetchCards(); }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <RefreshCw size={16} /> New Deck
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                disabled={currentIndex === cards.length - 1}
                className="p-4 rounded-full bg-indigo-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform shadow-indigo-500/30"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500">
            Failed to load cards. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};