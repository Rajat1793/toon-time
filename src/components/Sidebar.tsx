import React from 'react';
import { Timer, Hourglass, ClipboardList, Award, Sparkles, Grid3X3 } from 'lucide-react';
import { ActiveView, UserProfile } from '../types';

interface SidebarProps {
  currentView: ActiveView;
  onChangeView: (view: ActiveView) => void;
  userProfile: UserProfile;
  proUnlocked: boolean;
  onOpenUpgrade: () => void;
  isDottedBgOn: boolean;
}

export default function Sidebar({
  currentView,
  onChangeView,
  userProfile,
  proUnlocked,
  onOpenUpgrade,
  isDottedBgOn,
}: SidebarProps) {
  const bg          = isDottedBgOn ? 'bg-white'              : 'bg-[#0F0F0F]';
  const borderColor = isDottedBgOn ? 'border-[#0F0F0F]/10'  : 'border-white/10';
  const cardBg      = isDottedBgOn ? 'bg-[#F0F0F0]'         : 'bg-[#1A1A1A]';
  const textPrimary = isDottedBgOn ? 'text-[#0F0F0F]'       : 'text-white';
  const textMuted   = isDottedBgOn ? 'text-[#0F0F0F]/50'    : 'text-white/50';
  const navInactive = isDottedBgOn
    ? 'text-[#0F0F0F]/60 border border-transparent hover:text-[#0F0F0F] hover:bg-[#0F0F0F]/5 hover:border-[#0F0F0F]/10'
    : 'text-white/60 border border-transparent hover:text-white hover:bg-white/5 hover:border-white/10';
  const dividerBorder = isDottedBgOn ? 'border-[#0F0F0F]/5' : 'border-white/5';
  const upgradeBtnClass = isDottedBgOn
    ? `w-full ${cardBg} text-[#0F0F0F] hover:text-orange-500 hover:border-orange-500 font-sans text-xs font-bold py-3 px-4 rounded-xl border ${borderColor} transition-all cursor-pointer uppercase tracking-widest`
    : `w-full bg-[#1A1A1A] text-white hover:text-orange-500 hover:border-orange-500 font-sans text-xs font-bold py-3 px-4 rounded-xl border border-white/10 transition-all cursor-pointer uppercase tracking-widest`;

  return (
    <aside className={`hidden md:flex flex-col gap-6 p-6 h-[calc(100vh-5rem)] sticky top-20 ${bg} border-r ${borderColor} w-64 shrink-0 z-10 transition-colors`}>
      {/* Profile Card */}
      <div className={`flex items-center gap-3 p-3 ${cardBg} border ${borderColor} rounded-2xl`}>
        <div className="relative">
          <img
            alt={userProfile.name}
            className={`w-11 h-11 rounded-full border ${borderColor} ${cardBg} object-cover shrink-0`}
            src={userProfile.avatarUrl}
            referrerPolicy="no-referrer"
          />
          {proUnlocked && (
            <span className="absolute -top-1 -right-1 bg-orange-600 border border-black rounded-full p-0.5" title="Pro Captain">
              <Sparkles className="w-2.5 h-2.5 text-black fill-current" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className={`font-sans text-sm font-bold ${textPrimary} truncate leading-none mb-1`}>
            {userProfile.name}
          </div>
          <div className="flex items-center gap-1">
            <span className={`font-sans text-[10px] font-medium ${textMuted} tracking-wider uppercase`}>
              {userProfile.role}
            </span>
            {proUnlocked && (
              <span className="bg-orange-600/20 text-orange-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-orange-500/30">
                PRO
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 mt-2">
        {(['stopwatch', 'timer', 'laps', 'tictactoe'] as const).map((view) => {
          const labels: Record<string, string> = { stopwatch: 'Stopwatch', timer: 'Timer', laps: 'Laps', tictactoe: 'Tic Tac Toe' };
          const icons: Record<string, React.ReactNode> = {
            stopwatch: <Timer className="w-4 h-4 shrink-0" />,
            timer: <Hourglass className="w-4 h-4 shrink-0" />,
            laps: <ClipboardList className="w-4 h-4 shrink-0" />,
            tictactoe: <Grid3X3 className="w-4 h-4 shrink-0" />,
          };
          return (
            <button
              key={view}
              onClick={() => onChangeView(view)}
              className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-semibold rounded-full transition-all cursor-pointer ${
                currentView === view
                  ? 'bg-orange-600 text-black border border-orange-600'
                  : navInactive
              }`}
            >
              {icons[view]}
              <span>{labels[view]}</span>
            </button>
          );
        })}
      </nav>

      {/* Upgrade Callout */}
      <div className={`mt-auto pt-4 border-t ${dividerBorder}`}>
        {proUnlocked ? (
          <div className={`${cardBg} border border-orange-600/20 rounded-2xl p-3 flex items-center gap-2`}>
            <Award className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className={`font-sans text-[10px] font-bold ${isDottedBgOn ? 'text-[#0F0F0F]/80' : 'text-white/80'} uppercase tracking-wider`}>
              Premium License Active
            </span>
          </div>
        ) : (
          <button
            onClick={onOpenUpgrade}
            className={upgradeBtnClass}
          >
            Upgrade to Pro
          </button>
        )}
      </div>
    </aside>
  );
}
