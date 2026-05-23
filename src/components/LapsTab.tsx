import React, { useState } from 'react';
import { 
  Anchor, 
  History, 
  Play, 
  PlusCircle, 
  Utensils, 
  Activity, 
  Flame, 
  Award, 
  X,
  Clock,
  Notebook
} from 'lucide-react';
import { ActiveView, Lap, SavedTimer } from '../types';

interface LapsTabProps {
  laps: Lap[];
  savedTimers: SavedTimer[];
  setSavedTimers: (timers: SavedTimer[] | ((prev: SavedTimer[]) => SavedTimer[])) => void;
  onActivatePreset: (presetId: string) => void;
  isDottedBgOn: boolean;
}

export default function LapsTab({
  laps,
  savedTimers,
  setSavedTimers,
  onActivatePreset,
  isDottedBgOn,
}: LapsTabProps) {
  const textPrimary = isDottedBgOn ? 'text-[#0F0F0F]' : 'text-[#F0EFEA]';
  const [showAddTimerModal, setShowAddTimerModal] = useState(false);
  
  // Custom Timer Form State
  const [newTitle, setNewTitle] = useState('');
  const [newMinutes, setNewMinutes] = useState(1);
  const [newSeconds, setNewSeconds] = useState(0);
  const [newIcon, setNewIcon] = useState<'utensils' | 'activity' | 'zap' | 'bell' | 'star'>('activity');

  // Combine user captured laps with computed metadata
  const renderedLaps = laps.map((l, index) => ({
    ...l,
    num: laps.length - index,
    timestamp: index === 0 ? 'Just now' : `${index + 1}m ago`
  }));

  // Add saved timer
  const handleAddTimer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const totalDuration = (newMinutes * 60) + newSeconds;
    if (totalDuration <= 0) {
      alert("Avast! Set a duration greater than zero!");
      return;
    }

    const newTimer: SavedTimer = {
      id: 'preset_' + Date.now().toString(),
      title: newTitle.trim(),
      duration: totalDuration,
      icon: newIcon,
      type: 'LOGGED TASK',
    };

    setSavedTimers(prev => [...prev, newTimer]);
    
    // reset form
    setNewTitle('');
    setNewMinutes(1);
    setNewSeconds(0);
    setNewIcon('activity');
    setShowAddTimerModal(false);
  };

  // Helper renderer for custom selected icons
  const renderTimerIcon = (iconName: string) => {
    switch (iconName) {
      case 'utensils':
        return <Utensils className="w-5 h-5 text-orange-400" />;
      case 'zap':
        return <Flame className="w-5 h-5 text-amber-500" />;
      default:
        return <Activity className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <section className={`w-full max-w-4xl px-4 md:px-8 mt-6 mb-16 animate-fadeIn pb-12 ${textPrimary}`}>

      {/* Elegant Header sticker badge */}
      <div className="mb-10 text-left select-none">
        <span className="font-sans text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-600/10 border border-orange-500/20 px-3 py-1 rounded-full">
          CHRONICLE
        </span>
        <h1 className={`font-heading text-4xl md:text-5xl font-extrabold tracking-tight ${textPrimary} mt-3`}>
          Captain's Log
        </h1>
      </div>

      {/* Bento Grid layout with columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 select-none">
        
        {/* Recent Laps list column */}
        <div className="flex flex-col gap-6">
          <h2 className={`font-heading text-lg font-bold ${textPrimary} uppercase tracking-widest flex items-center gap-2 select-none`}>
            <Anchor className="w-5 h-5 text-orange-500" />
            <span>Recent Laps</span>
          </h2>

          <div className="flex flex-col gap-6">
            {renderedLaps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-black/30 text-center">
                <Anchor className="w-8 h-8 mb-3 opacity-30" />
                <p className="text-xs font-bold uppercase tracking-widest">No laps recorded yet</p>
                <p className="text-[10px] mt-1">Use the Stopwatch to capture splits</p>
              </div>
            ) : (
              renderedLaps.map((lap) => (
              <div 
                key={lap.id}
                className="p-5 cursor-pointer bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-xl hover:-translate-y-0.5 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-sans text-[9px] font-extrabold bg-orange-600 text-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    LAP #{lap.num}
                  </span>
                  <span className="text-white/40 font-bold text-xs select-none">
                    {lap.timestamp}
                  </span>
                </div>
                
                <div className="font-heading text-3xl font-black text-[#F0EFEA] tracking-tighter">
                  {lap.time}
                </div>
                
                {lap.note && (
                  <p className="font-sans text-xs text-white/60 font-semibold mt-1.5 italic">
                    "{lap.note}"
                  </p>
                )}
              </div>
            ))
            )}
          </div>
        </div>

        {/* History / Saved Preset timers list column */}
        <div className="flex flex-col gap-6">
          <h2 className={`font-heading text-lg font-bold ${textPrimary} uppercase tracking-widest flex items-center gap-2 select-none`}>
            <History className="w-5 h-5 text-orange-500" />
            <span>Saved Presets</span>
          </h2>

          <div className="flex flex-col gap-6">
            
            {/* Custom Saved preset list */}
            {savedTimers.map((timer) => {
              const mins = Math.floor(timer.duration / 60);
              const secs = timer.duration % 60;
              const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

              return (
                <div 
                  key={timer.id}
                  className="bg-[#1A1A1A] p-5 border border-white/10 rounded-2xl shadow-xl hover:-translate-y-0.5 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-10 h-10 bg-[#2A2A2A] border border-white/10 rounded-full flex items-center justify-center shrink-0">
                      {renderTimerIcon(timer.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading text-lg font-bold truncate leading-tight text-white tracking-tight">
                        {timer.title}
                      </h3>
                      <p className="font-sans text-[10px] font-black text-white/40 mt-1 uppercase tracking-wider">
                        {timer.type}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#2A2A2A] border border-white/5 p-3 flex justify-between items-center rounded-xl shadow-inner">
                    <span className="font-heading text-2xl font-bold text-orange-500 leading-none tabular-nums">
                      {formattedTime}
                    </span>
                    <button
                      onClick={() => onActivatePreset(timer.id)}
                      className="bg-orange-600 hover:bg-orange-700 text-black p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center shrink-0"
                      title="Load Setup and Start"
                    >
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Log New Task Trigger */}
            <button
              onClick={() => setShowAddTimerModal(true)}
              className="w-full h-32 border border-dashed border-white/15 rounded-3xl flex flex-col items-center justify-center gap-2 text-white/50 hover:text-white bg-[#1A1A1A]/40 hover:bg-[#1A1A1A]/85 hover:border-white/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-8 h-8 text-orange-500 shrink-0" />
              <span className="font-sans text-xs font-bold uppercase tracking-widest">Log New Preset</span>
            </button>

          </div>
        </div>

      </div>

      {/* Hero Poster segment at bottom of Captains log */}
      <div className="w-full mt-16 select-none">
        <div className="border border-white/10 overflow-hidden rounded-3xl bg-[#1A1A1A]/90 relative">
          <img
            className="w-full h-[280px] object-cover opacity-20 object-bottom shrink-0 select-none filter blur-[0.5px] grayscale hover:grayscale-0 transition-all duration-700"
            alt="Captain using custom oversized stopwatch representation"
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmgPhd3opo8uEEQ3yPX1CqS97cQHz565qXPS0khAzpZhWd4fWUKHyMFvc_93fAafuXcCwq-gsIEd4s9_K2qY71bmvfZP-X5qBowu0S4StAJ-wpH0V-Dm6iDPxSzERTKpzRvUkB2dSPWJ8N8S1GVeYeZ6ta9q-0we4NFNGJ65uVtzZyN9XS2ZVfGkFncZG1CFi75xsJXgfkIVo-_B8y2mlWcgUDDLBM7rOGulsSi7-c5RVCQKBmPu2pg6Li8kGiOmWWTo7tWhczbTsw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl shadow-xl">
            <p className="font-heading text-lg font-bold text-orange-500 uppercase tracking-widest italic">
              "Every second counts, Sailor!"
            </p>
            <p className="font-sans text-xs text-[#F0EFEA]/60 mt-1">
              Stay on course with the TOON-TIME tracking system.
            </p>
          </div>
        </div>
      </div>

      {/* Add New Preset Modal */}
      {showAddTimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fadeIn">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl w-full max-w-sm p-6 relative text-white shadow-2xl">
            <button
              onClick={() => setShowAddTimerModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2.5">
              <Notebook className="w-5 h-5 text-orange-500" />
              <h3 className="font-heading text-lg font-bold text-white italic tracking-tight">
                New Captain Preset
              </h3>
            </div>

            <form onSubmit={handleAddTimer} className="flex flex-col gap-4">
              
              {/* Title input */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F0EFEA]/50 mb-1">
                  Preset Label / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swab Deck Drill"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={25}
                  required
                  className="w-full px-3.5 py-2 border border-white/10 focus:border-orange-500 rounded-xl text-sm font-sans focus:outline-none bg-[#1A1A1A] text-white"
                />
              </div>

              {/* Duration adjusters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F0EFEA]/50 mb-1">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2 border border-white/10 focus:border-orange-500 bg-[#1A1A1A] text-white rounded-xl text-center font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F0EFEA]/50 mb-1">
                    Seconds
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={newSeconds}
                    onChange={(e) => setNewSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-full p-2 border border-white/10 focus:border-orange-500 bg-[#1A1A1A] text-white rounded-xl text-center font-bold text-sm"
                  />
                </div>
              </div>

              {/* Icon selectors */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F0EFEA]/50 mb-1">
                  Task Icon Type
                </label>
                <div className="flex gap-3 justify-center mt-1">
                  <button
                    type="button"
                    onClick={() => setNewIcon('utensils')}
                    className={`p-2.5 border rounded-xl flex items-center justify-center flex-1 cursor-pointer transition-all ${
                      newIcon === 'utensils' 
                        ? 'bg-orange-600 border-white/10 text-black font-bold' 
                        : 'border-white/5 bg-[#1A1A1A] text-white/60 hover:text-white hover:bg-[#2A2A2A]'
                    }`}
                  >
                    <Utensils className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewIcon('activity')}
                    className={`p-2.5 border rounded-xl flex items-center justify-center flex-1 cursor-pointer transition-all ${
                      newIcon === 'activity' 
                        ? 'bg-orange-600 border-white/10 text-black font-bold' 
                        : 'border-white/5 bg-[#1A1A1A] text-white/60 hover:text-white hover:bg-[#2A2A2A]'
                    }`}
                  >
                    <Activity className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewIcon('zap')}
                    className={`p-2.5 border rounded-xl flex items-center justify-center flex-1 cursor-pointer transition-all ${
                      newIcon === 'zap' 
                        ? 'bg-orange-600 border-white/10 text-black font-bold' 
                        : 'border-white/5 bg-[#1A1A1A] text-white/60 hover:text-white hover:bg-[#2A2A2A]'
                    }`}
                  >
                    <Flame className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-black font-sans text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer transition-colors mt-2"
              >
                Log New Preset ⚓
              </button>

            </form>
          </div>
        </div>
      )}

    </section>
  );
}
