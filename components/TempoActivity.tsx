import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Activity, Dumbbell, Zap, Clock, Info, BarChart3, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TempoActivityProps {
  onBack: () => void;
}

// Reusable Tab Button
const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      active
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    {label}
  </button>
);

// Reusable Range Control (Mini version for this specific layout)
const MiniRange: React.FC<{ label: string; value: number; min: number; max: number; onChange: (v: number) => void; unit?: string; color: string }> = ({
  label, value, min, max, onChange, unit = '', color
}) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs font-semibold mb-1.5">
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
      <span className={color}>{value}{unit}</span>
    </div>
    <input
      type="range" min={min} max={max} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-${color.split('-')[1]}-500`}
    />
  </div>
);

// Simple CSS Bar Chart Component
const SimpleBarChart: React.FC<{ labels: string[]; data: number[]; colors: string[]; label: string; maxVal?: number }> = ({ labels, data, colors, label, maxVal = 100 }) => (
  <div className="w-full h-48 flex items-end justify-between gap-2 pt-6">
    {data.map((val, i) => (
      <div key={i} className="flex-1 flex flex-col items-center group relative">
        {/* Tooltip */}
        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
          {labels[i]}: {val}
        </div>
        <div 
          className="w-full rounded-t-md transition-all duration-500 relative"
          style={{ height: `${(val / maxVal) * 100}%`, backgroundColor: colors[i % colors.length] }}
        ></div>
        <span className="text-[10px] text-slate-500 mt-2 text-center leading-tight">{labels[i]}</span>
      </div>
    ))}
  </div>
);

export const TempoActivity: React.FC<TempoActivityProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'sim' | 'strength' | 'hyper' | 'research'>('sim');
  
  // Controls
  const [ecc, setEcc] = useState(3);
  const [bot, setBot] = useState(0);
  const [con, setCon] = useState(1);
  const [top, setTop] = useState(0);
  const [reps, setReps] = useState(10); // Default to 10
  const [load, setLoad] = useState(79); // ~79% for 10 reps

  // Sim State
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRep, setCurrentRep] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'ecc' | 'bot' | 'con' | 'top'>('ecc');
  const [progress, setProgress] = useState(0); // 0 to 1 for current phase
  const [totalTut, setTotalTut] = useState(0);

  // Refs for animation loop
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const phaseTimeRef = useRef<number>(0);
  const totalTutRef = useRef<number>(0);
  
  // Derived Constants
  const repDuration = ecc + bot + con + top;

  // --- Animation Loop ---
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      
      if (!isPaused) {
        phaseTimeRef.current += deltaTime;
        totalTutRef.current += deltaTime;
        setTotalTut(totalTutRef.current);

        // Determine current phase duration
        let duration = 0;
        if (currentPhase === 'ecc') duration = ecc;
        else if (currentPhase === 'bot') duration = bot;
        else if (currentPhase === 'con') duration = con;
        else if (currentPhase === 'top') duration = top;

        // Calculate progress (0 to 1)
        let newProgress = duration > 0 ? Math.min(phaseTimeRef.current / duration, 1) : 1;
        setProgress(newProgress);

        // Check for phase completion
        if (phaseTimeRef.current >= duration) {
          phaseTimeRef.current = 0;
          
          if (currentPhase === 'ecc') {
            setCurrentPhase('bot');
          } else if (currentPhase === 'bot') {
            setCurrentPhase('con');
          } else if (currentPhase === 'con') {
            setCurrentPhase('top');
          } else if (currentPhase === 'top') {
            // Rep Complete
            if (currentRep + 1 < reps) {
              setCurrentRep(prev => prev + 1);
              setCurrentPhase('ecc');
            } else {
              // Set Complete
              setCurrentRep(reps);
              setIsRunning(false);
              return; // Stop loop
            }
          }
        }
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [currentPhase, currentRep, reps, ecc, bot, con, top, isPaused]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, animate]);

  // --- Handlers ---
  const startSet = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (currentRep === reps) {
         // Reset if finished
         setCurrentRep(0);
         setCurrentPhase('ecc');
         phaseTimeRef.current = 0;
         totalTutRef.current = 0;
         setTotalTut(0);
      } else if (currentRep === 0 && totalTut === 0) {
         // Fresh start
         previousTimeRef.current = performance.now();
         phaseTimeRef.current = 0;
      }
    }
    setIsPaused(false);
  };

  const pauseSet = () => {
    setIsPaused(true);
  };

  const resetSet = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentRep(0);
    setCurrentPhase('ecc');
    setProgress(0);
    setTotalTut(0);
    phaseTimeRef.current = 0;
    totalTutRef.current = 0;
  };

  // Sync Logic (Simplified RM map)
  const syncLoadToReps = (r: number) => {
    setReps(r);
    // Simple formula approximation: 100 - (reps * 2.5) roughly
    // Or map from source
    const map: Record<number, number> = {
        1: 100, 2: 97, 3: 94, 4: 92, 5: 89, 6: 87, 7: 85, 8: 83, 9: 81, 10: 79,
        12: 75, 15: 69, 20: 60, 25: 53, 30: 48
    };
    let l = 60;
    // find closest key
    let minDiff = 100;
    Object.keys(map).forEach(key => {
        const k = Number(key);
        if (Math.abs(r - k) < minDiff) {
            minDiff = Math.abs(r - k);
            l = map[k];
        }
    });
    setLoad(l);
  };

  const syncRepsToLoad = (l: number) => {
    setLoad(l);
    // Reverse lookup
    const map: Record<number, number> = {
        1: 100, 2: 97, 3: 94, 4: 92, 5: 89, 6: 87, 7: 85, 8: 83, 9: 81, 10: 79,
        12: 75, 15: 69, 20: 60, 25: 53, 30: 48
    };
    let r = 10;
    let minDiff = 100;
    Object.entries(map).forEach(([key, val]) => {
        if (Math.abs(l - val) < minDiff) {
             minDiff = Math.abs(l - val);
             r = Number(key);
        }
    });
    setReps(r);
  };

  // --- Visualizer Position Calculation ---
  // Top visual = 0%, Bottom visual = 100%
  // But weight stack moves UP against gravity.
  // Eccentric (Lowering weight stack) -> Visual moves DOWN (0% top to 100% bottom of container?? No, stack goes down)
  // Let's use CSS "bottom" property. 
  // Container height 250px.
  // Top: 220px (from bottom). Bottom: 20px (from bottom).
  // Eccentric: 220 -> 20.
  // Concentric: 20 -> 220.
  
  const getWeightPosition = () => {
    const minH = 20;
    const maxH = 220;
    const range = maxH - minH;
    
    if (currentPhase === 'ecc') {
      return maxH - (progress * range);
    } else if (currentPhase === 'bot') {
      return minH;
    } else if (currentPhase === 'con') {
      return minH + (progress * range);
    } else {
      return maxH; // top
    }
  };

  const weightBottom = getWeightPosition();

  // --- Scores Calculation ---
  const calculateScores = () => {
    const tutPerRep = ecc + bot + con + top;
    const totalTUT = tutPerRep * reps;
    
    // Strength
    let strScore = 0;
    if (load >= 85) strScore += 60;
    else if (load >= 75) strScore += 40;
    else strScore += 10;
    if (reps <= 5) strScore += 20;
    else if (reps <= 8) strScore += 10;
    if (con <= 1.5) strScore += 20; else strScore -= 10;

    // Hypertrophy
    let hypScore = 0;
    if (reps >= 6 && reps <= 25) hypScore += 50; 
    else if (reps >= 3 && reps <= 35) hypScore += 40;
    else hypScore += 20;
    if (tutPerRep >= 2 && tutPerRep <= 8) hypScore += 40;
    else if (tutPerRep > 8) hypScore += 20;
    else hypScore += 30;
    if (totalTUT >= 40) hypScore += 10;

    // Metabolic
    let metaScore = 0;
    if (totalTUT > 60) metaScore += 40;
    else if (totalTUT > 40) metaScore += 20;
    if (reps >= 15) metaScore += 40;
    else if (reps >= 10) metaScore += 20;
    if (bot === 0 && top === 0) metaScore += 20;

    return { 
        str: Math.min(100, Math.max(0, strScore)), 
        hyp: Math.min(100, Math.max(0, hypScore)), 
        meta: Math.min(100, Math.max(0, metaScore)) 
    };
  };

  const scores = calculateScores();

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
          <Activity size={16} className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Movement Tempo Explorer</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto">
           
           {/* Tabs */}
           <div className="flex justify-center gap-2 mb-8">
             <TabButton label="Simulation" active={activeTab === 'sim'} onClick={() => setActiveTab('sim')} />
             <TabButton label="Strength Analysis" active={activeTab === 'strength'} onClick={() => setActiveTab('strength')} />
             <TabButton label="Hypertrophy Analysis" active={activeTab === 'hyper'} onClick={() => setActiveTab('hyper')} />
             <TabButton label="Research Data" active={activeTab === 'research'} onClick={() => setActiveTab('research')} />
           </div>

           {activeTab === 'sim' && (
             <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
                
                {/* Visualizer Column */}
                <div className="space-y-6">
                   <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-indigo-500" /> Live Visualizer
                      </h3>
                      
                      {/* Animation Box */}
                      <div className="relative h-[280px] bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 overflow-hidden flex justify-center">
                         {/* Cable */}
                         <div className="absolute top-0 w-1 bg-slate-400 dark:bg-slate-600 z-0" style={{ bottom: `${weightBottom + 20}px` }}></div>
                         
                         {/* Phase Badge */}
                         <div className={`absolute top-4 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-sm transition-colors duration-300 ${
                           currentPhase === 'ecc' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                           currentPhase === 'con' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                           'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                         }`}>
                           {currentPhase === 'ecc' ? 'ECCENTRIC (Lowering)' : 
                            currentPhase === 'con' ? 'CONCENTRIC (Lifting)' : 
                            currentPhase === 'bot' ? 'BOTTOM PAUSE' : 'TOP PAUSE'}
                         </div>

                         {/* Weight Stack */}
                         <div 
                           className="absolute w-32 h-6 bg-slate-800 dark:bg-slate-600 rounded shadow-lg z-10 transition-transform duration-75 ease-linear"
                           style={{ bottom: `${weightBottom}px` }}
                         >
                           <div className="w-full h-full flex items-center justify-center gap-1 opacity-30">
                             <div className="w-1 h-3 bg-white rounded-full"></div>
                             <div className="w-1 h-3 bg-white rounded-full"></div>
                             <div className="w-1 h-3 bg-white rounded-full"></div>
                           </div>
                         </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{repDuration.toFixed(1)}s</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Time / Rep</div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{totalTut.toFixed(1)}s</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total TUT</div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{currentRep} / {reps}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Reps Done</div>
                        </div>
                      </div>

                      {/* Play Controls */}
                      <div className="grid grid-cols-3 gap-3">
                         <button 
                           onClick={startSet}
                           disabled={isRunning && !isPaused}
                           className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white py-3 rounded-xl font-bold transition-colors"
                         >
                           <Play size={18} /> {isPaused ? 'Resume' : 'Start'}
                         </button>
                         <button 
                           onClick={pauseSet}
                           disabled={!isRunning || isPaused}
                           className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-white py-3 rounded-xl font-bold transition-colors"
                         >
                           <Pause size={18} /> Pause
                         </button>
                         <button 
                           onClick={resetSet}
                           className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white py-3 rounded-xl font-bold transition-colors"
                         >
                           <RotateCcw size={18} /> Reset
                         </button>
                      </div>
                   </div>

                   {/* Charts Mini */}
                   <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Time Under Tension Distribution</h3>
                      <SimpleBarChart 
                        labels={['Eccentric', 'Bottom', 'Concentric', 'Top']}
                        data={[ecc * reps, bot * reps, con * reps, top * reps]}
                        colors={['#ef4444', '#f97316', '#eab308', '#3b82f6']} // Red, Orange, Yellow, Blue
                        label="Seconds"
                        maxVal={Math.max(ecc, bot, con, top) * reps * 1.2 || 10}
                      />
                   </div>
                </div>

                {/* Controls Column */}
                <div className="space-y-6">
                   <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock size={18} className="text-indigo-500" /> Tempo Settings
                         </h3>
                         <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
                           {ecc}/{bot}/{con}/{top}
                         </div>
                      </div>

                      <MiniRange label="Eccentric (Lowering)" value={ecc} min={1} max={8} onChange={setEcc} unit="s" color="text-red-500" />
                      <MiniRange label="Bottom Pause" value={bot} min={0} max={5} onChange={setBot} unit="s" color="text-orange-500" />
                      <MiniRange label="Concentric (Lifting)" value={con} min={1} max={8} onChange={setCon} unit="s" color="text-yellow-500" />
                      <MiniRange label="Top Pause" value={top} min={0} max={5} onChange={setTop} unit="s" color="text-blue-500" />
                      
                      <hr className="border-slate-200 dark:border-slate-700 my-6" />
                      
                      <div className="grid grid-cols-2 gap-6">
                         <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                            <MiniRange label="Total Reps" value={reps} min={1} max={30} onChange={syncLoadToReps} color="text-slate-600" />
                         </div>
                         <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                            <MiniRange label="Load (% 1RM)" value={load} min={30} max={100} onChange={syncRepsToLoad} unit="%" color="text-slate-600" />
                         </div>
                      </div>
                   </div>

                   {/* Predictions */}
                   <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-500" /> Predicted Effect
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                         {[
                           { label: 'Strength', score: scores.str, color: '#3b82f6' },
                           { label: 'Hypertrophy', score: scores.hyp, color: '#ec4899' },
                           { label: 'Metabolic', score: scores.meta, color: '#10b981' },
                         ].map((item, i) => (
                           <div key={i} className="flex flex-col items-center">
                              <div 
                                className="w-20 h-20 rounded-full flex items-center justify-center relative mb-2"
                                style={{ background: `conic-gradient(${item.color} ${item.score}%, #e2e8f0 ${item.score}%)` }}
                              >
                                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-900 dark:text-white">
                                  {item.score}
                                </div>
                              </div>
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                           </div>
                         ))}
                      </div>
                      <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed border border-indigo-100 dark:border-indigo-500/30">
                        {scores.hyp > 80 ? 
                          "Excellent parameters for hypertrophy! The combination of rep range and time under tension is optimal." : 
                        scores.str > 80 ? 
                          "Optimized for strength. High load and lower reps prioritize neural adaptations." :
                          "Metabolic focus. High time under tension creates significant stress."
                        }
                      </div>
                   </div>
                </div>

             </div>
           )}

           {activeTab === 'strength' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Concentric Velocity is King</h2>
                   <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                     Recent reviews (Wilk et al., 2021) confirm that for 1RM strength development, the <strong className="text-indigo-600 dark:text-indigo-400">Concentric Velocity</strong> is paramount. While the bar may move slowly due to heavy loads (>85%), the <em>intent</em> must be explosive.
                   </p>
                   <div className="grid md:grid-cols-2 gap-8 mt-8">
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Zap size={18} className="text-yellow-500" /> Intent to Move</h4>
                        <SimpleBarChart 
                          labels={['Explosive', 'Controlled', 'Slow']}
                          data={[95, 70, 40]}
                          colors={['#2563eb', '#60a5fa', '#94a3b8']}
                          label="Strength Gain"
                        />
                        <p className="text-xs text-slate-500 mt-4 text-center">Voluntarily slowing down reduces motor unit recruitment.</p>
                      </div>
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                           <CheckCircle2 className="text-emerald-500 flex-shrink-0" />
                           <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Eccentric Control:</strong> 2-4 seconds is optimal for stability without excessive fatigue.</p>
                        </div>
                        <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                           <AlertCircle className="text-amber-500 flex-shrink-0" />
                           <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Avoid Super Slow:</strong> >6s eccentrics significantly limit the load you can handle.</p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'hyper' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The "Hypertrophy Range" Updated</h2>
                   <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                     Research now shows that hypertrophy is robust across a wide range of reps (5 to 30), provided the set is taken near failure. Tempo is a tool to standardize volume, but mechanical tension remains the primary driver.
                   </p>
                   
                   <div className="grid md:grid-cols-2 gap-8">
                     <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-pink-500" /> Rep Ranges (Equated Volume)</h4>
                        <SimpleBarChart 
                          labels={['3 Reps', '8 Reps', '15 Reps', '35+ Reps']}
                          data={[70, 95, 95, 60]}
                          colors={['#f472b6', '#ec4899', '#db2777', '#9d174d']}
                          label="Effect"
                        />
                        <p className="text-xs text-slate-500 mt-4 text-center">Similar growth 8-30 reps. Drop off at extremes.</p>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Clock size={18} className="text-indigo-500" /> Rep Duration Efficiency</h4>
                        <SimpleBarChart 
                          labels={['Fast (<2s)', 'Mod (2-6s)', 'Slow (6-9s)', '>10s']}
                          data={[80, 95, 90, 50]}
                          colors={['#818cf8', '#6366f1', '#4f46e5', '#312e81']}
                          label="Efficacy"
                        />
                        <p className="text-xs text-slate-500 mt-4 text-center">Super slow reps require too much load reduction.</p>
                     </div>
                   </div>
                </div>
              </div>
           )}

           {activeTab === 'research' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                 <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Evidence-Based Guidelines</h2>
                    <div className="space-y-6">
                       <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-l-4 border-indigo-500">
                          <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Wilk et al. (2021) - Sports (MDPI)</h4>
                          <p className="text-slate-600 dark:text-slate-300 italic mb-2">"The Influence of Movement Tempo..."</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                             Found that a wide range of tempos (2s to 8s per repetition) are effective for hypertrophy. However, for strength, fast concentric actions are superior. Extremely slow training ({'>'}10s) produces inferior results due to significantly reduced load.
                          </p>
                       </div>
                       <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-l-4 border-emerald-500">
                          <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Schoenfeld et al. (Consensus)</h4>
                          <p className="text-slate-600 dark:text-slate-300 italic mb-2">"Strength and Hypertrophy Adaptations..."</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                             Meta-analyses indicate that low-load (high rep) training produces similar hypertrophy to high-load (low rep) training when volume is equated and failure is reached. The "Hypertrophy Zone" is much wider than previously thought (approx 6-30 reps).
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
};