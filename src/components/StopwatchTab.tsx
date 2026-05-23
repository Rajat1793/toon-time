import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Flag, RotateCcw, Leaf } from 'lucide-react';
import { Lap } from '../types';

interface StopwatchTabProps {
  laps: Lap[];
  setLaps: (laps: Lap[] | ((prev: Lap[]) => Lap[])) => void;
  isDottedBgOn: boolean;
}

export default function StopwatchTab({ laps, setLaps, isDottedBgOn }: StopwatchTabProps) {
  const textPrimary = isDottedBgOn ? 'text-[#0F0F0F]'      : 'text-[#F0EFEA]';
  const textSec     = isDottedBgOn ? 'text-[#0F0F0F]/60'   : 'text-[#F0EFEA]/60';
  const textMut     = isDottedBgOn ? 'text-[#0F0F0F]/40'   : 'text-white/40';
  const cardBg      = isDottedBgOn ? 'bg-white'            : 'bg-[#1A1A1A]';
  const cardBg2     = isDottedBgOn ? 'bg-[#F0F0F0]'        : 'bg-[#2A2A2A]';
  const borderC     = isDottedBgOn ? 'border-[#0F0F0F]/10' : 'border-white/10';
  const borderC15   = isDottedBgOn ? 'border-[#0F0F0F]/10' : 'border-white/15';
  const [milliseconds, setMilliseconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop watch tick loop (10ms intervals for centiseconds resolution)
  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - milliseconds * 10;
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 10);
        setMilliseconds(elapsed);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Format Elapsed Time: "MM:SS:CC" (Minutes, Seconds, Centiseconds)
  const getFormattedTime = (totalMs: number) => {
    const ms = totalMs % 100;
    const seconds = Math.floor((totalMs / 100) % 60);
    const minutes = Math.floor((totalMs / 6000) % 60);

    const displayMs = ms.toString().padStart(2, '0');
    const displaySec = seconds.toString().padStart(2, '0');
    const displayMin = minutes.toString().padStart(2, '0');

    return `${displayMin}:${displaySec}:${displayMs}`;
  };

  // Progress fills over 60 seconds (looping feel)
  const seconds = Math.floor((milliseconds / 100) % 60);
  const progressPercent = Math.min(100, Math.floor((seconds / 60) * 100));

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMilliseconds(0);
  };

  const handleLap = () => {
    if (milliseconds === 0) return;
    const newLapTime = getFormattedTime(milliseconds);
    
    // List of fun, random, pirate/sailor quotes for Lap comments in Captain's Log
    const quotes = [
      "Swabbing the deck intensity!",
      "Sailing against the tide.",
      "Anchor drop is ready!",
      "Full speed ahead towards the safe harbor!",
      "Spinach power at peak performance!",
      "Scouting the horizon with extreme focus!",
      "Sea shanty beat match maximum!",
      "Gale force winds ahead!",
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    const newLap: Lap = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      num: laps.length + 1,
      title: "Spinach Burst",
      time: newLapTime,
      timestamp: "Just now",
      note: randomQuote,
    };

    setLaps(prev => [newLap, ...prev]);
  };

  return (
    <div className={`w-full max-w-xl mx-auto flex flex-col items-center gap-10 mt-4 animate-fadeIn ${textPrimary}`}>
      
      {/* Massive Timer Display Card */}
      <section className="w-full select-none">
        <div className={`${cardBg} border ${borderC} p-8 md:p-12 text-center rounded-3xl shadow-xl relative overflow-hidden group`}>
          
          {/* Faded watermark words */}
          <div className="absolute top-3 left-4 opacity-5 font-heading font-black text-4xl rotate-12 pointer-events-none text-white">
            SPINACH
          </div>
          <div className="absolute bottom-3 right-4 opacity-5 font-heading font-black text-4xl -rotate-12 pointer-events-none text-white">
            POWER
          </div>

          {/* Running Clock value */}
          <div className={`font-heading text-6xl md:text-8xl tabular-nums tracking-tighter ${textPrimary} z-10 relative font-black`}>
            {getFormattedTime(milliseconds)}
          </div>

          <div className="mt-4 font-sans text-[10px] font-bold text-orange-400 bg-orange-600/10 border border-orange-500/20 inline-block px-4 py-1.5 rounded-full uppercase tracking-widest select-none">
            EST. 1929
          </div>
        </div>
      </section>

      {/* Spinach Power Progress Bar */}
      <section className="w-full">
        <div className={`flex justify-between items-end mb-2 font-sans text-[11px] font-bold uppercase tracking-widest ${isDottedBgOn ? 'text-[#0F0F0F]/60' : 'text-[#F0EFEA]/60'} select-none`}>
          <span>Spinach Power</span>
          <span>{progressPercent}%</span>
        </div>
        
        <div className={`w-full h-10 border ${borderC15} ${cardBg} rounded-full p-1 overflow-hidden`}>
          <div 
            className="h-full bg-orange-600 rounded-full transition-all duration-300 flex items-center justify-end px-3 select-none" 
            style={{ width: `${progressPercent}%` }}
          >
            {progressPercent > 5 && (
              <Leaf className="w-4 h-4 text-white animate-pulse shrink-0" fill="currentColor" />
            )}
          </div>
        </div>
      </section>

      {/* Control Buttons row */}
      <section className="flex flex-wrap md:flex-nowrap gap-4 w-full">
        
        {/* Toggle Start/Pause Button */}
        <button
          onClick={handleStartPause}
          className={`flex-1 min-w-[130px] h-16 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-white cursor-pointer ${
            isRunning 
              ? 'bg-red-600 hover:bg-red-700 border border-red-600' 
              : 'bg-orange-600 hover:bg-orange-700 text-black border border-orange-600'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-white stroke-none" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current stroke-none" />
              <span>START</span>
            </>
          )}
        </button>

        {/* Lap Split Trigger Button */}
        <button
          onClick={handleLap}
          disabled={milliseconds === 0}
          className={`flex-1 min-w-[130px] h-16 rounded-full border font-sans text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${cardBg} ${
            milliseconds === 0 
              ? `opacity-30 cursor-not-allowed ${borderC} ${textMut}` 
              : `${borderC} ${isDottedBgOn ? 'hover:border-[#0F0F0F]/20 hover:bg-[#F0F0F0]' : 'hover:border-white/40 hover:bg-[#2A2A2A]'} ${textPrimary}`
          }`}
        >
          <Flag className="w-4 h-4 fill-white stroke-none" />
          <span>LAP</span>
        </button>

        {/* Clear/Reset Button */}
        <button
          onClick={handleReset}
          className={`w-16 h-16 rounded-full border ${borderC} ${cardBg} ${textPrimary} ${isDottedBgOn ? 'hover:bg-[#0F0F0F]/5' : 'hover:bg-white/5'} transition-all flex items-center justify-center shrink-0 cursor-pointer`}
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

      </section>

      {/* Output Log of splitting laps */}
      <section className="w-full flex flex-col gap-4">
        <h2 className={`font-heading text-xl font-bold ${textPrimary} tracking-tight self-start select-none uppercase italic tracking-widest`}>
          Recent Laps
        </h2>
        
        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
          {laps.length === 0 ? (
              <div className={`text-center py-8 border border-dashed ${borderC} ${isDottedBgOn ? 'bg-[#0F0F0F]/5' : 'bg-[#1A1A1A]/30'} ${textMut} text-xs font-semibold rounded-2xl select-none uppercase tracking-widest`}>
              No laps logged yet, Sailor! Click LAP during timing.
            </div>
          ) : (
            laps.map((lap, i) => (
              <div 
                key={lap.id}
                className={`flex items-center justify-between p-4 border ${borderC} ${cardBg} rounded-2xl shadow-md ${isDottedBgOn ? 'hover:border-[#0F0F0F]/20 hover:bg-[#F0F0F0]' : 'hover:border-white/20 hover:bg-[#202020]'} transition-all animate-fadeIn`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full ${isDottedBgOn ? 'bg-[#0F0F0F]/5' : 'bg-white/5'} flex items-center justify-center border ${borderC} font-sans text-xs font-bold ${textSec} shrink-0`}>
                    {laps.length - i}
                  </span>
                  <div>
                    <span className={`font-sans text-xs font-semibold ${textPrimary}`}>
                      {lap.title}
                    </span>
                    {lap.note && (
                      <p className={`font-sans text-[11px] ${textSec} italic mt-0.5`}>
                        "{lap.note}"
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-heading text-lg font-bold tabular-nums text-orange-500">
                  {lap.time}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Fun Mascot Illustration bouncing */}
      <div className={`pointer-events-none mt-4 select-none shrink-0 border ${borderC} ${isDottedBgOn ? 'bg-[#F0F0F0]/80' : 'bg-[#1A1A1A]/80'} p-3 rounded-2xl shadow-xl`} style={{ transform: "translateY(10px)" }}>
        <img
          alt="Popeye Strongarm Strength Mascot"
          className="w-20 h-20 object-contain selection:bg-transparent filter invert"
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFbmZ7ijNXsJH7RldOiN1al29MIvrJpihu7OiUdIjHbvyqz6xy22mRZ9ahdeS7CGR4cDNdaGJx_mJvL35zrPe8UxZXEEIZDqLGMIyj8kDuLf2nscRRrU_aykCsuMwlHfC3UPQVaJNWk2RQdNA5ln6hRNgccX5cqINwaLgsN1BRNt-_fqC3rmFIW7P_Gay7YtbRXT3HapFG63FildR6xAtyvvnJLfpIkmsOD2o9SMZ0-HfIaJ2d9eOZ4RtO0M5cAcnBVGVmUn-Of_W1"
        />
      </div>

    </div>
  );
}
