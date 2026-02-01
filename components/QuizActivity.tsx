import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, CheckCircle2, XCircle, Trophy, GraduationCap, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../types';
import { generateQuizQuestion } from '../services/gemini';

interface QuizActivityProps {
  onBack: () => void;
}

export const QuizActivity: React.FC<QuizActivityProps> = ({ onBack }) => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadNewQuestion = async () => {
    setIsLoading(true);
    setSelectedOptionIndex(null);
    const data = await generateQuizQuestion();
    setQuestion(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const handleRetry = () => {
    setSelectedOptionIndex(null);
  };

  const isCurrentSelectionCorrect = selectedOptionIndex !== null && question?.options[selectedOptionIndex].isCorrect;

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
          <GraduationCap className="text-indigo-600 dark:text-indigo-400" size={20} />
          <h2 className="font-bold text-slate-900 dark:text-white">Knowledge Check</h2>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="animate-spin text-indigo-600 dark:text-indigo-400" size={40} />
              <p className="text-slate-600 dark:text-slate-400 animate-pulse">Consulting the AI Professor...</p>
            </div>
          ) : question ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Question Card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200 dark:border-slate-700">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                  Topic Assessment
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                  {question.question}
                </h2>
              </div>

              {/* Options Grid */}
              <div className="grid gap-4">
                {question.options.map((option, index) => {
                  const isSelected = selectedOptionIndex === index;
                  const isAnswered = selectedOptionIndex !== null;
                  
                  let cardStyle = "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md cursor-pointer";
                  let icon = null;

                  if (isAnswered) {
                    if (isSelected) {
                      if (option.isCorrect) {
                        cardStyle = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 ring-1 ring-emerald-500 cursor-default";
                        icon = <CheckCircle2 className="text-emerald-500" size={24} />;
                      } else {
                        cardStyle = "bg-red-50 dark:bg-red-900/20 border-red-500 ring-1 ring-red-500 cursor-default";
                        icon = <XCircle className="text-red-500" size={24} />;
                      }
                    } else {
                      cardStyle = "opacity-50 grayscale cursor-default border-slate-200 dark:border-slate-700";
                    }
                  } else {
                    cardStyle += " bg-white dark:bg-slate-800";
                  }

                  return (
                    <div key={index} className="space-y-3">
                      <div 
                        onClick={() => !isAnswered && setSelectedOptionIndex(index)}
                        className={`relative rounded-2xl p-6 border-2 transition-all duration-200 flex items-center justify-between ${cardStyle}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            isAnswered && isSelected 
                              ? (option.isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800')
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className={`font-medium text-lg ${isAnswered && !isSelected ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                            {option.text}
                          </span>
                        </div>
                        {icon}
                      </div>

                      {/* Feedback Display */}
                      {isAnswered && isSelected && (
                        <div className={`p-6 rounded-2xl animate-in zoom-in-95 duration-300 ${
                          option.isCorrect 
                            ? 'bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100' 
                            : 'bg-red-100/50 dark:bg-red-900/30 text-red-900 dark:text-red-100'
                        }`}>
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            {option.isCorrect ? 'Correct Analysis' : 'Misconception Correction'}
                          </h4>
                          <p className="leading-relaxed">
                            {option.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              {selectedOptionIndex !== null && (
                <div className="flex justify-end pt-4 pb-12">
                  {!isCurrentSelectionCorrect ? (
                    <button 
                      onClick={handleRetry}
                      className="flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
                    >
                      <RotateCcw size={20} /> Try Again
                    </button>
                  ) : (
                    <button 
                      onClick={loadNewQuestion}
                      className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
                    >
                      Next Question <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="text-center text-red-500">
              Something went wrong. Please try refreshing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};