import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Pause, 
  Play, 
  RotateCcw, 
  Zap, 
  Star, 
  Award, 
  Anchor, 
  Plus, 
  Check, 
  Trash2,
  ListTodo
} from 'lucide-react';
import { AppSettings, SavedTimer } from '../types';

interface TimerTabProps {
  appSettings: AppSettings;
  setAppSettings: (settings: AppSettings | ((prev: AppSettings) => AppSettings)) => void;
  savedTimers: SavedTimer[];
  // If loaded via a saved timer click, we can receive initial settings
  triggerPresetId: string | null;
  clearTriggerPreset: () => void;
}

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function TimerTab({
  appSettings,
  setAppSettings,
  savedTimers,
  triggerPresetId,
  clearTriggerPreset,
}: TimerTabProps) {
  // Timer States
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Completion modal
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [sessionPoints, setSessionPoints] = useState(0);

  // Validation error for empty timer start
  const [startError, setStartError] = useState(false);

  // Task List States
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('toon_time_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Timer reference
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load Preset if triggered from "Saved Timers"
  useEffect(() => {
    if (triggerPresetId) {
      const preset = savedTimers.find(t => t.id === triggerPresetId);
      if (preset) {
        const mins = Math.floor(preset.duration / 60);
        const secs = preset.duration % 60;
        setMinutes(mins);
        setSeconds(secs);
        
        // Auto start
        const total = preset.duration;
        setTimeLeft(total);
        setInitialTime(total);
        setIsRunning(true);
        setIsPaused(false);
      }
      clearTriggerPreset();
    }
  }, [triggerPresetId, savedTimers, clearTriggerPreset]);

  // Persist tasks
  useEffect(() => {
    localStorage.setItem('toon_time_tasks', JSON.stringify(tasks));
    // Update completion counts dynamically in parent global settings
    const incompleteCount = tasks.filter(t => !t.completed).length;
    setAppSettings(prev => {
      if (prev.tasksCompleted !== tasks.filter(t => t.completed).length) {
        return {
          ...prev,
          tasksCompleted: tasks.filter(t => t.completed).length
        };
      }
      return prev;
    });
  }, [tasks, setAppSettings]);

  // Main Timer Countdown loop
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Completed!
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const pointsEarned = 50;
    setAppSettings(prev => ({
      ...prev,
      spinachPoints: prev.spinachPoints + pointsEarned
    }));

    if (appSettings.isVolumeOn) {
      playCompletionSound();
    }

    setSessionPoints(pointsEarned);
    setShowCompleteModal(true);
  };

  // Adjust timers
  const adjustTime = (type: 'min' | 'sec', amount: number) => {
    if (isRunning) return;
    if (type === 'min') {
      setMinutes(prev => {
        const next = prev + amount;
        if (next < 0) return 99;
        if (next > 99) return 0;
        return next;
      });
    } else {
      setSeconds(prev => {
        const next = prev + amount;
        if (next < 0) return 59;
        if (next > 59) return 0;
        return next;
      });
    }
  };

  const startTimer = () => {
    const totalSeconds = (minutes * 60) + seconds;
    if (totalSeconds <= 0) {
      setStartError(true);
      setTimeout(() => setStartError(false), 2000);
      return;
    }
    setStartError(false);
    setTimeLeft(totalSeconds);
    setInitialTime(totalSeconds);
    setIsRunning(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
  };

  // Helper formatting values
  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const playCompletionSound = () => {
    try {
      const ctx = new AudioContext();
      const playTone = (freq: number, startTime: number, duration: number, gain = 0.35) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gainNode.gain.setValueAtTime(gain, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      // Ascending ship-bell chime: C5 → E5 → G5 → C6
      playTone(523, now, 0.6);
      playTone(659, now + 0.25, 0.6);
      playTone(784, now + 0.5, 0.6);
      playTone(1047, now + 0.75, 1.2);
    } catch (_) {
      // AudioContext unavailable
    }
  };

  const incompleteCount = tasks.filter(t => !t.completed).length;

  const isDottedBgOn = appSettings.isDottedBgOn;
  const cardBg  = isDottedBgOn ? 'bg-white'            : 'bg-[#1A1A1A]';
  const cardBg2 = isDottedBgOn ? 'bg-[#F0F0F0]'        : 'bg-[#2A2A2A]';
  const borderC = isDottedBgOn ? 'border-[#0F0F0F]/10' : 'border-white/10';
  const textPri = isDottedBgOn ? 'text-[#0F0F0F]'      : 'text-[#F0EFEA]';
  const textSec = isDottedBgOn ? 'text-[#0F0F0F]/60'   : 'text-[#F0EFEA]/60';
  const textMut = isDottedBgOn ? 'text-[#0F0F0F]/40'   : 'text-white/40';

  // Calculate progress and animate anchor
  const progressPercent = initialTime > 0 ? (1 - timeLeft / initialTime) : 0;
  // Let the anchor bob sideways based on a sine wave of the remaining seconds
  const anchorBobAmount = isRunning && !isPaused ? Math.sin(timeLeft) * 8 : 0;

  return (
    <section className={`w-full flex flex-col items-center gap-12 mt-4 relative ${textPri}`}>
      {/* Decorative Anchor Track on the Right (Only viewable when timer is running on Desktop) */}
      {isRunning && (
        <div className={`absolute right-0 top-0 w-16 h-[320px] hidden lg:flex flex-col items-center pointer-events-none z-10 ${isDottedBgOn ? 'bg-[#E0E0E0]/80' : 'bg-[#1A1A1A]/80'} border ${borderC} rounded-full p-1 shadow-inner`}>
          <div className="w-0.5 bg-white/10 h-full absolute top-0 left-1/2 -translate-x-1/2"></div>
          <div 
            className="absolute left-1/2 flex flex-col items-center transition-all duration-300"
            style={{ 
              top: `${progressPercent * 80}%`, // move between 0% and 80% of track length
              transform: `translateX(calc(-50% + ${anchorBobAmount}px))`,
            }}
          >
            <Anchor className="text-orange-500 fill-orange-600/20 w-10 h-10 stroke-[2]" />
            <div className="bg-orange-600 text-black border border-orange-600 rounded px-1.5 py-0.5 text-[9px] font-black uppercase shadow-sm mt-1 shrink-0">
              ⚓ {Math.round(progressPercent * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Large Display Container */}
      <div className={`w-full max-w-3xl ${cardBg} border ${borderC} rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden`}>
        
        {!isRunning ? (
          /* SETUP VIEW */
          <div className="w-full flex flex-col items-center animate-fadeIn">
            <div className={`font-sans text-xs font-semibold ${textSec} uppercase tracking-widest mb-6 select-none`}>
              Set Duration
            </div>

            {/* Rotary-Style Input Group */}
            <div className="flex items-center gap-4 mb-8">
              
              {/* Minutes Column */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => adjustTime('min', 1)}
                  className={`w-10 h-10 ${cardBg2} ${isDottedBgOn ? 'hover:bg-[#E0E0E0]' : 'hover:bg-[#3A3A3A]'} border ${borderC} hover:border-orange-500 rounded-full flex items-center justify-center ${textPri} transition-all cursor-pointer`}
                >
                  <ChevronUp className="w-5 h-5 stroke-[2.5]" />
                </button>
                
                <input
                  type="number"
                  value={minutes.toString().padStart(2, '0')}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value);
                    if (!isNaN(parsed)) setMinutes(Math.max(0, Math.min(99, parsed)));
                  }}
                  className={`w-24 h-24 text-center font-heading text-5xl ${cardBg2} ${textPri} border ${borderC} focus:border-orange-500 rounded-2xl focus:ring-0 focus:outline-none p-2 font-black transition-colors`}
                  max="99"
                  min="0"
                />
                
                <button
                  type="button"
                  onClick={() => adjustTime('min', -1)}
                  className={`w-10 h-10 ${cardBg2} ${isDottedBgOn ? 'hover:bg-[#E0E0E0]' : 'hover:bg-[#3A3A3A]'} border ${borderC} hover:border-orange-500 rounded-full flex items-center justify-center ${textPri} transition-all cursor-pointer`}
                >
                  <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className={`font-sans text-[10px] font-bold mt-2 ${textMut} tracking-wider`}>MIN</span>
              </div>

              <span className={`font-heading text-5xl font-black ${textMut} select-none`}>:</span>

              {/* Seconds Column */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => adjustTime('sec', 1)}
                  className={`w-10 h-10 ${cardBg2} ${isDottedBgOn ? 'hover:bg-[#E0E0E0]' : 'hover:bg-[#3A3A3A]'} border ${borderC} hover:border-orange-500 rounded-full flex items-center justify-center ${textPri} transition-all cursor-pointer`}
                >
                  <ChevronUp className="w-5 h-5 stroke-[2.5]" />
                </button>
                
                <input
                  type="number"
                  value={seconds.toString().padStart(2, '0')}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value);
                    if (!isNaN(parsed)) setSeconds(Math.max(0, Math.min(59, parsed)));
                  }}
                  className={`w-24 h-24 text-center font-heading text-5xl ${cardBg2} ${textPri} border ${borderC} focus:border-orange-500 rounded-2xl focus:ring-0 focus:outline-none p-2 font-black transition-colors`}
                  max="59"
                  min="0"
                />

                <button
                  type="button"
                  onClick={() => adjustTime('sec', -1)}
                  className={`w-10 h-10 ${cardBg2} ${isDottedBgOn ? 'hover:bg-[#E0E0E0]' : 'hover:bg-[#3A3A3A]'} border ${borderC} hover:border-orange-500 rounded-full flex items-center justify-center ${textPri} transition-all cursor-pointer`}
                >
                  <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className={`font-sans text-[10px] font-bold mt-2 ${textMut} tracking-wider`}>SEC</span>
              </div>

            </div>

            {startError && (
              <p className="text-orange-500 text-xs font-bold uppercase tracking-widest animate-pulse mb-2">
                ⚓ Set the time first, Captain!
              </p>
            )}

            {/* Huge Spinach Can Button with Popeye vintage logo */}
            <button
              onClick={startTimer}
              className={`group relative w-44 h-44 bg-[#1A1A1A] rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-all active:scale-95 border ${
                startError ? 'border-orange-500 animate-pulse' : 'border-white/20 hover:border-orange-500'
              }`}
            >
              <img
                className="w-full h-full object-cover scale-110 group-hover:rotate-6 transition-transform opacity-10 group-hover:opacity-20"
                referrerPolicy="no-referrer"
                alt="A vibrant spinach can vintage style representation"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_gqhLUrmdtziPWC-udO7G0l-Ov1fYwy9_3sN_nyf-0WhRWJr0x_UPLm5ZVsWVIRURUQADtOPwHgToTBrMSkatraH9eMIvGLp5f95LrRg8gV56EEpI_ignSpibFFXtXFGdZ0byHgyzHJq8uedAZuJALnKgDwkyYIJA9Qz1gcV8AVhFMbujnN2u__Y1Wd6YT-CM7eX_yEBdjgrFcAtr1tcNrmDH5qwEVSD67U6L_05xs-OPjbMr0BNiwwrtnGzZ0uXTzj65QNAmBnis"
              />
              <div className="absolute inset-0 bg-transparent"></div>
              <span className="absolute text-orange-500 font-sans text-lg font-black tracking-widest uppercase pointer-events-none group-hover:text-orange-400 transition-colors">
                START
              </span>
            </button>
          </div>
        ) : (
          /* RUNNING VIEW */
          <div className="w-full flex flex-col items-center py-6 animate-fadeIn">
            {/* Spinning background dial decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>
            
            {/* Countdown timer */}
            <div className={`font-heading text-6xl md:text-8xl font-black tracking-tight mb-12 tabular-nums ${textPri} select-none z-10 font-bold`}>
              {formatTime(timeLeft)}
            </div>

            {/* Control buttons */}
            <div className="flex gap-6 z-10">
              <button
                onClick={togglePause}
                title={isPaused ? "Resume" : "Pause"}
                className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isPaused 
                    ? 'bg-orange-600 text-black border-orange-600 hover:bg-[#ea580c]'
                    : isDottedBgOn ? 'bg-transparent text-[#0F0F0F] border-[#0F0F0F]/15 hover:bg-[#0F0F0F]/5' : 'bg-transparent text-[#F0EFEA] border-white/20 hover:bg-white/5'
                }`}
              >
                {isPaused ? (
                  <Play className="w-6 h-6 fill-current stroke-none" />
                ) : (
                  <Pause className="w-6 h-6 fill-current stroke-none" />
                )}
              </button>

              <button
                onClick={resetTimer}
                title="Reset Timer"
                className={`w-16 h-16 bg-transparent ${textSec} ${isDottedBgOn ? 'hover:text-[#0F0F0F] border-[#0F0F0F]/15 hover:bg-[#0F0F0F]/5' : 'hover:text-white border-white/20 hover:bg-white/5'} rounded-full border flex items-center justify-center transition-all cursor-pointer`}
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>

            {/* Micro progress indicator */}
              <div className={`w-full max-w-sm mt-8 border ${borderC} rounded-full h-3 ${cardBg2} p-0.5 overflow-hidden`}>
              <div 
                className="bg-orange-600 h-full rounded-full transition-all duration-300" 
                style={{ width: `${(timeLeft / initialTime) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

      </div>

      {/* Features Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        
        {/* Focus Sessions Card (Take 2 columns) */}
        <div className={`col-span-1 md:col-span-2 ${cardBg} ${textPri} p-6 border ${borderC} rounded-2xl flex flex-col justify-between`}>
          <div>
            <div className={`font-heading text-xl md:text-2xl font-black mb-3 ${textPri} italic tracking-tight`}>
              Focus Sessions
            </div>
            <p className={`font-sans text-xs md:text-sm leading-relaxed mb-6 font-medium ${textSec}`}>
              Channel your inner Popeye. Each focused session powers up your productivity meter. 
              Earn <strong>"Spinach Points"</strong> for completing rounds without interruption.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className={`w-9 h-9 rounded-full border border-orange-600/30 ${cardBg2} flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer`} title="Bolt of Strength">
                <Zap className="w-4 h-4 text-orange-500" fill="currentColor" />
              </div>
              <div className={`w-9 h-9 rounded-full border border-orange-600/30 ${cardBg2} flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer`} title="Star Achiever">
                <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
              </div>
              <div className={`w-9 h-9 rounded-full border border-orange-600/30 ${cardBg2} flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer`} title="Premium Log Badge">
                <Award className="w-4 h-4 text-orange-400" fill="currentColor" />
              </div>
            </div>

            <div className={`text-[10px] font-sans font-bold uppercase py-1 px-3 ${isDottedBgOn ? 'bg-[#0F0F0F]/5 border-[#0F0F0F]/10' : 'bg-white/5 border-white/10'} border rounded-full text-orange-400 tracking-wider`}>
              🥬 points: {appSettings.spinachPoints}
            </div>
          </div>
        </div>

        {/* Ahoy / Checklist Trigger Card (1 column) */}
        <button
          onClick={() => setShowTaskModal(true)}
          className={`${cardBg} border border-orange-600/20 hover:border-orange-500 text-orange-500 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer group hover:scale-[1.02] transition-transform`}
        >
          <div className={`w-12 h-12 rounded-full ${cardBg2} border border-orange-500/20 flex items-center justify-center mb-3 shadow-sm group-hover:rotate-12 transition-transform`}>
            <Anchor className="w-5 h-5 text-orange-500" />
          </div>
          <div className={`font-heading text-lg font-bold uppercase select-none tracking-wider ${textPri}`}>
            Ahoy!
          </div>
          <div className={`font-sans text-[10px] font-black opacity-80 mt-2 select-none tracking-widest ${textSec}`}>
            {incompleteCount} {incompleteCount === 1 ? 'TASK' : 'TASKS'} LEFT
          </div>
          <span className="text-[10px] uppercase font-bold text-orange-400 mt-2 hover:underline shrink-0">
            Click to Manage
          </span>
        </button>

      </div>

      {/* Timer Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fadeIn">
          <div className="bg-[#0F0F0F] border border-orange-500/30 rounded-3xl w-full max-w-sm p-6 text-white relative shadow-2xl text-center select-none">
            <div className="w-16 h-16 rounded-full bg-orange-600/20 border border-orange-500 flex items-center justify-center text-orange-500 mb-4 mx-auto animate-bounce">
              <Anchor className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl font-black text-white uppercase tracking-tight italic mb-1">
              Mission Complete!
            </h3>
            <p className="text-xs text-orange-400 font-bold uppercase tracking-widest mb-4">
              Shipshape &amp; Bristol Fashion
            </p>
            <div className="bg-orange-600/10 border border-orange-500/20 rounded-2xl p-4 mb-5">
              <p className="text-3xl font-black text-orange-500 font-heading">+{sessionPoints}</p>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">Spinach Points Earned</p>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Total: {appSettings.spinachPoints} pts</p>
            </div>
            <button
              onClick={() => setShowCompleteModal(false)}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-black font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
            >
              Back to Deck ⚓
            </button>
          </div>
        </div>
      )}

      {/* Task List / Checklist Drawer Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fadeIn">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl w-full max-w-sm p-6 text-white relative shadow-2xl">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 bg-[#2A2A2A] text-white/80 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <ListTodo className="w-5 h-5 text-orange-500" />
              <h3 className="font-heading text-lg font-black text-white italic tracking-tight">
                Captain's Agenda
              </h3>
            </div>

            {/* Mini Add Task Form */}
            <form onSubmit={addTask} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Log secondary plan..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                maxLength={40}
                className="flex-1 px-3 py-1.5 border border-white/10 rounded-lg text-xs font-sans focus:outline-none focus:border-orange-500 bg-[#1A1A1A] text-white"
              />
              <button
                type="submit"
                className="px-3 bg-orange-600 hover:bg-orange-700 text-black rounded-lg font-bold text-xs cursor-pointer transition-colors"
              >
                Add
              </button>
            </form>

            {/* Todo Items */}
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto mb-2 pr-1">
              {tasks.length === 0 ? (
                <div className="text-center py-6 text-white/40 text-xs italic">
                  All ship chores completed, Captain!
                </div>
              ) : (
                tasks.map(task => (
                  <div 
                    key={task.id}
                    className="flex justify-between items-center p-2.5 border border-white/5 rounded-xl bg-[#1A1A1A] hover:border-white/10 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-2_5 flex-grow min-w-0 flex-row"
                    >
                      <div className={`w-5 h-5 border border-white/20 rounded flex items-center justify-center bg-[#2A2A2A] shrink-0 ${
                        task.completed ? 'bg-orange-600 border-orange-600' : ''
                      }`}>
                        {task.completed && <Check className="w-3.5 h-3.5 text-black stroke-[4]" />}
                      </div>
                      <span className={`text-xs text-left truncate ml-2.5 ${
                        task.completed ? 'line-through text-white/30' : 'text-white/80 font-medium'
                      }`}>
                        {task.text}
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-500 p-1 rounded hover:bg-white/5 ml-1.5 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 text-[9px] text-white/40 font-bold uppercase tracking-widest text-center">
              ⚓ {tasks.filter(t => t.completed).length} items done — {tasks.filter(t => !t.completed).length} items remaining
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
