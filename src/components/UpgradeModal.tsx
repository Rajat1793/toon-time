import { useState } from 'react';
import { Sparkles, Trophy, Check } from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgradeComplete: () => void;
}

export default function UpgradeModal({ onClose, onUpgradeComplete }: UpgradeModalProps) {
  const [success, setSuccess] = useState(false);

  const handleUpgrade = () => {
    onUpgradeComplete();
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fadeIn">
      <div className="bg-[#0F0F0F] border border-white/10 rounded-[24px] w-full max-w-sm p-6 text-[#F0EFEA] relative shadow-2xl select-none">
        
        {/* Close Toggle */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 bg-[#2A2A2A] text-white hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
        >
          ✕
        </button>

        {!success ? (
          <>
            {/* Header Icon */}
            <div className="flex flex-col items-center text-center mt-2 mb-4">
              <div className="w-14 h-14 rounded-full bg-orange-600/10 border border-orange-500/30 flex items-center justify-center text-orange-500 animate-pulse">
                <Trophy className="w-6 h-6 fill-none" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white uppercase tracking-tight mt-3 leading-tight italic">
                Upgrade to Pro License!
              </h3>
              <p className="font-sans text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">
                Unlimited Spinach Strength
              </p>
            </div>

            {/* Benefits panel */}
            <div className="flex flex-col gap-3 my-4 bg-orange-600/5 p-4 border border-orange-500/10 rounded-2xl">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Check className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Exclusive Pro Captain Sparkle Badge</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Check className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Unlimited Custom Saved Presets Log</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Check className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Custom Captain Character avatars selection</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Check className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Priority access to safe sailing routes map</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleUpgrade}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-black font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4.5 h-4.5 fill-current text-black" />
              <span>Unlock Spinach License</span>
            </button>

            <p className="text-[9px] text-[#F0EFEA]/30 font-bold text-center uppercase tracking-wide mt-3 select-none">
              One-time purchase, sailing forever!
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-orange-600/20 border border-orange-500 flex items-center justify-center text-orange-500 mb-4 animate-bounce">
              <Sparkles className="w-8 h-8 fill-current" />
            </div>
            
            <h3 className="font-heading text-2xl font-black text-white italic tracking-tight mb-2">
              HUZZAH!
            </h3>
            
            <p className="font-sans text-sm text-[#F0EFEA]/80 leading-relaxed max-w-[280px] mb-6">
              Spinach License Activated! You are now a licensed <strong>PRO Captain</strong> of Toon Time! Visual badges and exclusive content are now unlocked.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-black font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
            >
              All Aboard! ⚓
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
