import { X, Award, Anchor, Timer, Flame } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fadeIn">
      <div className="bg-[#0F0F0F] border border-white/10 rounded-[24px] w-full max-w-sm p-6 text-[#F0EFEA] relative shadow-2xl select-none">
        
        {/* Close Toggle */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 bg-[#2A2A2A] text-white hover:text-white flex items-center justify-center text-sm cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-heading text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-600/10 px-3 py-1.5 border border-orange-500/20 rounded-lg italic">
            Voyager Guide
          </h3>
        </div>

        <p className="font-sans text-xs font-semibold text-white/60 leading-relaxed mb-4">
          Welcome aboard, Sailor! Let's get you acquainted with the <strong>TOON-TIME</strong> dashboard machinery to maximize spinach power levels!
        </p>

        {/* Feature List */}
        <div className="flex flex-col gap-3.5">
          
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2A2A2A] border border-white/10 flex items-center justify-center mt-0.5 shrink-0">
              <Timer className="w-4.5 h-4.5 text-orange-500" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold text-white leading-tight">Stopwatch & Splitting</p>
              <p className="font-sans text-[11px] text-white/50 mt-0.5">
                Log splits with the <strong>LAP</strong> button. Each split records a <em>Spinach Burst</em> lap that flows directory into the Captain's Log.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2A2A2A] border border-white/10 flex items-center justify-center mt-0.5 shrink-0">
              <Anchor className="w-4.5 h-4.5 text-orange-500" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold text-white leading-tight">Nautical Anchored Timer</p>
              <p className="font-sans text-[11px] text-white/50 mt-0.5">
                Start focus durations using the huge Popeye Spinach Can. Keep productive while the heavy anchor physical gauge descends dynamically.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2A2A2A] border border-white/10 flex items-center justify-center mt-0.5 shrink-0">
              <Flame className="w-4.5 h-4.5 text-orange-500" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold text-white leading-tight">Preset Tasks & Logs</p>
              <p className="font-sans text-[11px] text-white/50 mt-0.5">
                Click presets on the <strong>Laps</strong> page to hot-load routine timers, or click <strong>Log New Preset</strong> to append your own!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2A2A2A] border border-white/10 flex items-center justify-center mt-0.5 shrink-0">
              <Award className="w-4.5 h-4.5 text-orange-500" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold text-white leading-tight">Spinach Points & Pro</p>
              <p className="font-sans text-[11px] text-white/50 mt-0.5">
                Complete timer rounds to increase points! Click <strong>Upgrade to Pro</strong> to gain advanced captain status badges.
              </p>
            </div>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-black font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-colors mt-5 cursor-pointer"
        >
          Aye, Aye, Captain!
        </button>

      </div>
    </div>
  );
}
