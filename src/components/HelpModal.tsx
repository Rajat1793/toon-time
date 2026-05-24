import { Award, Anchor, Timer, Flame } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
  isDottedBgOn: boolean;
}

export default function HelpModal({ onClose, isDottedBgOn }: HelpModalProps) {
  const modalBg   = isDottedBgOn ? 'bg-[#FBF5DD]'          : 'bg-[#0D530E]';
  const borderC   = isDottedBgOn ? 'border-[#0D530E]/15'   : 'border-[#FBF5DD]/15';
  const iconBg    = isDottedBgOn ? 'bg-[#E7E1B1]'           : 'bg-[#16421A]';
  const closeBg   = isDottedBgOn ? 'bg-[#E7E1B1]'           : 'bg-[#16421A]';
  const textPri   = isDottedBgOn ? 'text-[#0D530E]'         : 'text-[#FBF5DD]';
  const textSec   = isDottedBgOn ? 'text-[#0D530E]/60'      : 'text-[#FBF5DD]/60';
  const textMut   = isDottedBgOn ? 'text-[#0D530E]/50'      : 'text-[#FBF5DD]/50';
  const closeText = isDottedBgOn ? 'text-[#0D530E]'         : 'text-[#FBF5DD]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fadeIn">
      <div className={`${modalBg} border ${borderC} rounded-[24px] w-full max-w-sm p-6 ${textPri} relative shadow-2xl select-none`}>
        
        {/* Close Toggle */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full border ${borderC} ${closeBg} ${closeText} flex items-center justify-center text-sm cursor-pointer`}
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-heading text-xs font-bold text-[#306D29] uppercase tracking-widest bg-[#306D29]/10 px-3 py-1.5 border border-[#306D29]/25 rounded-lg italic">
            Voyager Guide
          </h3>
        </div>

        <p className={`font-sans text-xs font-semibold ${textSec} leading-relaxed mb-4`}>
          Welcome aboard, Sailor! Let's get you acquainted with the <strong>TOON-TIME</strong> dashboard machinery to maximize spinach power levels!
        </p>

        {/* Feature List */}
        <div className="flex flex-col gap-3.5">
          
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl ${iconBg} border ${borderC} flex items-center justify-center mt-0.5 shrink-0`}>
              <Timer className="w-4.5 h-4.5 text-[#306D29]" />
            </div>
            <div>
              <p className={`font-heading text-sm font-semibold ${textPri} leading-tight`}>Stopwatch & Splitting</p>
              <p className={`font-sans text-[11px] ${textMut} mt-0.5`}>
                Log splits with the <strong>LAP</strong> button. Each split records a <em>Spinach Burst</em> lap that flows directory into the Captain's Log.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl ${iconBg} border ${borderC} flex items-center justify-center mt-0.5 shrink-0`}>
              <Anchor className="w-4.5 h-4.5 text-[#306D29]" />
            </div>
            <div>
              <p className={`font-heading text-sm font-semibold ${textPri} leading-tight`}>Nautical Anchored Timer</p>
              <p className={`font-sans text-[11px] ${textMut} mt-0.5`}>
                Start focus durations using the huge Popeye Spinach Can. Keep productive while the heavy anchor physical gauge descends dynamically.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl ${iconBg} border ${borderC} flex items-center justify-center mt-0.5 shrink-0`}>
              <Flame className="w-4.5 h-4.5 text-[#306D29]" />
            </div>
            <div>
              <p className={`font-heading text-sm font-semibold ${textPri} leading-tight`}>Preset Tasks & Logs</p>
              <p className={`font-sans text-[11px] ${textMut} mt-0.5`}>
                Click presets on the <strong>Laps</strong> page to hot-load routine timers, or click <strong>Log New Preset</strong> to append your own!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl ${iconBg} border ${borderC} flex items-center justify-center mt-0.5 shrink-0`}>
              <Award className="w-4.5 h-4.5 text-[#306D29]" />
            </div>
            <div>
              <p className={`font-heading text-sm font-semibold ${textPri} leading-tight`}>Spinach Points & Pro</p>
              <p className={`font-sans text-[11px] ${textMut} mt-0.5`}>
                Complete timer rounds to increase points! Click <strong>Upgrade to Pro</strong> to gain advanced captain status badges.
              </p>
            </div>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#306D29] hover:bg-[#0D530E] text-[#FBF5DD] font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-colors mt-5 cursor-pointer"
        >
          Aye, Aye, Captain!
        </button>

      </div>
    </div>
  );
}
