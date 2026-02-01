import React, { useState, useMemo } from 'react';
import { ArrowLeft, Timer, Activity, Dumbbell, Wind, Clock, AlertTriangle, CheckCircle2, Flame, Snowflake, Repeat, ArrowRightLeft, HeartPulse, Zap, PlayCircle, PauseCircle, StopCircle } from 'lucide-react';

interface SimulatorActivityProps {
  onBack: () => void;
}

// Reusable Slider Component for consistency
interface RangeControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  unit?: string;
  colorClass: string;
  icon?: React.ElementType;
  description?: string;
}

const RangeControl: React.FC<RangeControlProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  onChange, 
  unit = '', 
  colorClass, 
  icon: Icon,
  description
}) => (
  <div className="group relative">
    <div className="flex justify-between items-end mb-3">
      <div className="flex flex-col">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {Icon && <Icon size={16} className={`${colorClass} opacity-80`} />}
          {label}
        </span>
        {description && <span className="text-[10px] text-slate-400 font-medium ml-6 mt-0.5">{description}</span>}
      </div>
      <div className="text-right bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md min-w-[3.5rem]">
        <span className={`text-lg font-bold tabular-nums tracking-tight ${colorClass}`}>
          {value}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium ml-1">{unit}</span>
      </div>
    </div>
    
    <div className="relative h-6 flex items-center">
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-opacity-50 ${colorClass.replace('text-', 'accent-')}`}
      />
    </div>
  </div>
);

export const SimulatorActivity: React.FC<SimulatorActivityProps> = ({ onBack }) => {
  // --- State ---
  const [targetTime, setTargetTime] = useState(45);
  
  // Variables
  const [warmupMin, setWarmupMin] = useState(5);
  
  // Resistance
  const [exercises, setExercises] = useState(6);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  
  // Tempo
  const [eccentric, setEccentric] = useState(3);
  const [bottom, setBottom] = useState(0);
  const [concentric, setConcentric] = useState(1);
  const [top, setTop] = useState(0);
  
  // Rest & Trans
  const [restSec, setRestSec] = useState(60);
  const [transSec, setTransSec] = useState(60);
  
  // Cardio & Cool
  const [cardioMin, setCardioMin] = useState(10);
  const [cooldownMin, setCooldownMin] = useState(5);

  // --- Calculations ---
  const stats = useMemo(() => {
    const warmupSeconds = warmupMin * 60;
    const cardioSeconds = cardioMin * 60;
    const cooldownSeconds = cooldownMin * 60;

    // Lifting Time: (Time per rep * Reps * Sets * Exercises)
    const repDuration = eccentric + bottom + concentric + top;
    const liftingSeconds = repDuration * reps * sets * exercises;

    // Rest Time: (Sets - 1) * Rest * Exercises
    // Only apply rest if there is more than 1 set
    const totalRestSeconds = sets > 1 ? (sets - 1) * restSec * exercises : 0;

    // Transition Time: (Exercises - 1) * Transition
    const totalTransSeconds = exercises > 1 ? (exercises - 1) * transSec : 0;

    const totalSeconds = warmupSeconds + liftingSeconds + totalRestSeconds + totalTransSeconds + cardioSeconds + cooldownSeconds;
    
    return {
      warmup: warmupSeconds,
      lifting: liftingSeconds,
      rest: totalRestSeconds,
      trans: totalTransSeconds,
      cardio: cardioSeconds,
      cooldown: cooldownSeconds,
      total: totalSeconds,
      repDuration
    };
  }, [warmupMin, exercises, sets, reps, eccentric, bottom, concentric, top, restSec, transSec, cardioMin, cooldownMin]);

  // --- Helpers ---
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalMinutes = stats.total / 60;
  const maxScale = 90; // 90 minutes max on bar
  const progressPct = Math.min((totalMinutes / maxScale) * 100, 100);
  const targetPct = (targetTime / maxScale) * 100;

  // Insight Logic
  let statusColor = 'bg-emerald-500';
  let statusMessage = '';
  const diff = (targetTime * 60) - stats.total;
  
  const orangeThreshold = targetTime - 5;

  if (totalMinutes > targetTime) {
    statusColor = 'bg-red-500';
    statusMessage = `You are ${Math.ceil(Math.abs(diff)/60)} minutes over target. Reduce rest, sets, or cardio.`;
  } else if (totalMinutes > orangeThreshold) {
    statusColor = 'bg-amber-500';
    statusMessage = `You are close to the limit! ${Math.floor(diff/60)} min remaining. Careful with adding volume.`;
  } else {
    statusColor = 'bg-emerald-500';
    statusMessage = `Great pace! You are comfortably under the limit with ${Math.floor(diff/60)} minutes to spare.`;
  }

  // Chart Gradient
  const getGradient = () => {
    if (stats.total === 0) return 'conic-gradient(#eee 0deg 360deg)';
    
    const degWarm = (stats.warmup / stats.total) * 360;
    const degLift = (stats.lifting / stats.total) * 360;
    const degRest = (stats.rest / stats.total) * 360;
    const degTrans = (stats.trans / stats.total) * 360;
    const degCardio = (stats.cardio / stats.total) * 360;
    const degCool = (stats.cooldown / stats.total) * 360; // Remainder

    return `conic-gradient(
      #3b82f6 0deg ${degWarm}deg,
      #10b981 ${degWarm}deg ${degWarm + degLift}deg,
      #8b5cf6 ${degWarm + degLift}deg ${degWarm + degLift + degRest}deg,
      #f472b6 ${degWarm + degLift + degRest}deg ${degWarm + degLift + degRest + degTrans}deg,
      #ef4444 ${degWarm + degLift + degRest + degTrans}deg ${degWarm + degLift + degRest + degTrans + degCardio}deg,
      #f59e0b ${degWarm + degLift + degRest + degTrans + degCardio}deg 360deg
    )`;
  };

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
          <Timer size={16} className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Session Design Simulator</h2>
        </div>
      </div>

      {/* Main Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
          
          {/* Challenge Selector */}
          <div className="text-center space-y-4 pt-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Workout Time Efficiency</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Can you design your ideal exercise session in under <span className="font-bold text-indigo-600 dark:text-indigo-400">{targetTime} min</span>? 
            </p>
            <div className="flex items-center justify-center gap-3">
              {[30, 45, 60].map(time => (
                <button
                  key={time}
                  onClick={() => setTargetTime(time)}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all shadow-sm ${
                    targetTime === time 
                      ? 'bg-indigo-600 text-white shadow-indigo-500/30 transform scale-105' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600'
                  }`}
                >
                  {time} Min Challenge
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: CONTROLS */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Warm Up */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-t-4 border-t-blue-500 border-x border-b border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                      <Flame size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Warm-up</h3>
                  </div>
                </div>
                
                <RangeControl 
                  label="General Warm-up" 
                  value={warmupMin} 
                  min={0} max={20} 
                  onChange={setWarmupMin} 
                  unit="min"
                  colorClass="text-blue-500"
                  icon={Activity}
                  description="Light cardio, dynamic stretching, mobility work"
                />
              </div>

              {/* 2. Resistance */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-t-4 border-t-emerald-500 border-x border-b border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                      <Dumbbell size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Resistance Training</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Main lifting component</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Volume Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <RangeControl label="Exercises" value={exercises} min={1} max={12} onChange={setExercises} colorClass="text-emerald-600" unit="" icon={Zap} />
                    <RangeControl label="Sets / Ex" value={sets} min={1} max={6} onChange={setSets} colorClass="text-emerald-600" unit="" icon={Repeat} />
                    <RangeControl label="Reps / Set" value={reps} min={1} max={30} onChange={setReps} colorClass="text-emerald-600" unit="" icon={CheckCircle2} />
                  </div>

                  {/* Tempo Section */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Clock size={14} /> Tempo (Seconds per rep)
                      </h4>
                      <div className="text-xs font-mono bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">
                        1 Rep = {stats.repDuration}s
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                       <RangeControl label="Eccentric" value={eccentric} min={1} max={6} onChange={setEccentric} colorClass="text-emerald-500" unit="s" icon={PlayCircle} description="Lowering" />
                       <RangeControl label="Bottom" value={bottom} min={0} max={5} onChange={setBottom} colorClass="text-emerald-500" unit="s" icon={StopCircle} description="Pause" />
                       <RangeControl label="Concentric" value={concentric} min={1} max={5} onChange={setConcentric} colorClass="text-emerald-500" unit="s" icon={PauseCircle} description="Lifting" />
                       <RangeControl label="Top" value={top} min={0} max={5} onChange={setTop} colorClass="text-emerald-500" unit="s" icon={StopCircle} description="Pause" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Rest & Transition */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Rest */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-t-4 border-t-violet-500 border-x border-b border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
                      <Clock size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Rest</h3>
                  </div>
                  <RangeControl 
                    label="Inter-set Rest" 
                    value={restSec} min={15} max={300} step={15} 
                    onChange={setRestSec} unit="s" 
                    colorClass="text-violet-500" 
                    icon={Timer} 
                    description="Recovery between sets"
                  />
                </div>

                {/* Transition */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-t-4 border-t-pink-400 border-x border-b border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-500 dark:text-pink-400">
                      <ArrowRightLeft size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Transition</h3>
                  </div>
                  <RangeControl 
                    label="Exercise Switch" 
                    value={transSec} min={15} max={300} step={15} 
                    onChange={setTransSec} unit="s" 
                    colorClass="text-pink-400" 
                    icon={ArrowRightLeft} 
                    description="Setup time between exercises"
                  />
                </div>
              </div>

              {/* 4. Cardio & Cool down */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-t-4 border-t-red-500 border-x border-b border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-500 dark:text-red-400">
                    <HeartPulse size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Cardio & Recovery</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <RangeControl 
                    label="Cardio" 
                    value={cardioMin} min={0} max={40} 
                    onChange={setCardioMin} unit="min" 
                    colorClass="text-red-500" 
                    icon={Wind} 
                    description="Aerobic conditioning work"
                  />
                  <RangeControl 
                    label="Cool-down" 
                    value={cooldownMin} min={0} max={20} 
                    onChange={setCooldownMin} unit="min" 
                    colorClass="text-amber-500" 
                    icon={Snowflake} 
                    description="Static stretching, foam rolling"
                  />
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: DASHBOARD */}
            <div className="lg:col-span-5 space-y-6">
               <div className="sticky top-6 space-y-6">
                  
                  {/* Total Time Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative">
                    <div className={`absolute top-0 left-0 w-full h-1 ${statusColor}`}></div>
                    <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                      <Timer size={14} /> Total Session Duration
                    </h3>
                    <div className="text-center mb-6 py-4">
                      <div className="text-6xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                        {formatTime(stats.total)}
                      </div>
                      <div className="text-sm text-slate-400 mt-2 font-medium">minutes : seconds</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2 shadow-inner">
                      <div 
                         className={`absolute top-0 left-0 h-full transition-all duration-500 ${statusColor} shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
                         style={{ width: `${progressPct}%` }}
                      ></div>
                      {/* Target Marker */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-black/80 dark:bg-white/80 z-10"
                        style={{ left: `${targetPct}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>0 min</span>
                      <span className={totalMinutes > targetTime ? 'text-red-500' : 'text-indigo-500'}>Target: {targetTime} min</span>
                      <span>90 min</span>
                    </div>
                  </div>

                  {/* Visualization & Insight */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                     <div className="flex justify-center mb-8">
                        <div 
                          className="w-56 h-56 rounded-full relative shadow-lg"
                          style={{ background: getGradient() }}
                        >
                          <div className="absolute inset-0 m-10 bg-white dark:bg-slate-800 rounded-full flex flex-col items-center justify-center shadow-inner">
                            <span className="text-3xl font-bold text-slate-700 dark:text-slate-200">{Math.round((stats.lifting/stats.total)*100) || 0}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Lifting</span>
                          </div>
                        </div>
                     </div>
                     
                     <div className={`rounded-xl p-4 border ${
                        statusColor === 'bg-emerald-500' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' :
                        statusColor === 'bg-amber-500' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200' :
                        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                     }`}>
                       <div className="flex gap-3">
                          {statusColor === 'bg-emerald-500' ? <CheckCircle2 className="flex-shrink-0 mt-0.5" size={18} /> : <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />}
                          <p className="text-sm font-medium leading-relaxed">{statusMessage}</p>
                       </div>
                     </div>
                  </div>

                  {/* Breakdown Table */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                     <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Time Breakdown</h3>
                     <div className="space-y-3">
                        {[
                          { label: 'Warm-up', val: stats.warmup, dot: 'bg-blue-500' },
                          { label: 'Lifting', val: stats.lifting, dot: 'bg-emerald-500' },
                          { label: 'Rest', val: stats.rest, dot: 'bg-violet-500' },
                          { label: 'Transition', val: stats.trans, dot: 'bg-pink-400' },
                          { label: 'Cardio', val: stats.cardio, dot: 'bg-red-500' },
                          { label: 'Cool-down', val: stats.cooldown, dot: 'bg-amber-500' },
                        ].map((row, i) => (
                          <div key={i} className="flex justify-between items-center text-sm border-b border-dashed border-slate-100 dark:border-slate-700 pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <span className={`w-2.5 h-2.5 rounded-full ${row.dot} shadow-sm`}></span>
                              <span className="text-slate-600 dark:text-slate-400 font-medium">{row.label}</span>
                            </div>
                            <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{formatTime(row.val)}</span>
                          </div>
                        ))}
                     </div>
                  </div>

               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};