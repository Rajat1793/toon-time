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
  const bg          = isDottedBgOn ? 'bg-[#FBF5DD]'           : 'bg-[#0D530E]';
  const borderColor = isDottedBgOn ? 'border-[#0D530E]/15'    : 'border-[#FBF5DD]/15';
  const cardBg      = isDottedBgOn ? 'bg-[#E7E1B1]'           : 'bg-[#16421A]';
  const textPrimary = isDottedBgOn ? 'text-[#0D530E]'         : 'text-[#FBF5DD]';
  const textMuted   = isDottedBgOn ? 'text-[#0D530E]/50'      : 'text-[#FBF5DD]/50';
  const navInactive = isDottedBgOn
    ? 'text-[#0D530E]/60 border border-transparent hover:text-[#0D530E] hover:bg-[#0D530E]/5 hover:border-[#0D530E]/10'
    : 'text-[#FBF5DD]/60 border border-transparent hover:text-[#FBF5DD] hover:bg-[#FBF5DD]/5 hover:border-[#FBF5DD]/10';
  const dividerBorder = isDottedBgOn ? 'border-[#0D530E]/5'   : 'border-[#FBF5DD]/5';
  const upgradeBtnClass = isDottedBgOn
    ? `w-full ${cardBg} text-[#0D530E] hover:text-[#306D29] hover:border-[#306D29] font-sans text-xs font-bold py-3 px-4 rounded-xl border ${borderColor} transition-all cursor-pointer uppercase tracking-widest`
    : `w-full bg-[#16421A] text-[#FBF5DD] hover:text-[#E7E1B1] hover:border-[#306D29] font-sans text-xs font-bold py-3 px-4 rounded-xl border border-[#FBF5DD]/15 transition-all cursor-pointer uppercase tracking-widest`;

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
            <span className="absolute -top-1 -right-1 bg-[#306D29] border border-[#0D530E] rounded-full p-0.5" title="Pro Captain">
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
              <span className="bg-[#306D29]/20 text-[#306D29] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#306D29]/30">
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
                  ? 'bg-[#306D29] text-[#FBF5DD] border border-[#306D29]'
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
          <div className={`${cardBg} border border-[#306D29]/25 rounded-2xl p-3 flex items-center gap-2`}>
            <Award className="w-4 h-4 text-[#306D29] animate-pulse" />
            <span className={`font-sans text-[10px] font-bold ${isDottedBgOn ? 'text-[#0D530E]/80' : 'text-[#FBF5DD]/80'} uppercase tracking-wider`}>
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
