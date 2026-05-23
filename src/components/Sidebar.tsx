import { Timer, Hourglass, ClipboardList, Award, Sparkles } from 'lucide-react';
import { ActiveView, UserProfile } from '../types';

interface SidebarProps {
  currentView: ActiveView;
  onChangeView: (view: ActiveView) => void;
  userProfile: UserProfile;
  proUnlocked: boolean;
  onOpenUpgrade: () => void;
}

export default function Sidebar({
  currentView,
  onChangeView,
  userProfile,
  proUnlocked,
  onOpenUpgrade,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col gap-6 p-6 h-[calc(100vh-5rem)] sticky top-20 bg-[#0F0F0F] border-r border-white/10 w-64 shrink-0 z-10 transition-colors">
      {/* Profile Card */}
      <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-white/10 rounded-2xl">
        <div className="relative">
          <img
            alt={userProfile.name}
            className="w-11 h-11 rounded-full border border-white/20 bg-[#2A2A2A] object-cover shrink-0"
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
          <div className="font-sans text-sm font-bold text-white truncate leading-none mb-1">
            {userProfile.name}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-sans text-[10px] font-medium text-white/50 tracking-wider uppercase">
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
        <button
          onClick={() => onChangeView('stopwatch')}
          className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-semibold rounded-full transition-all cursor-pointer ${
            currentView === 'stopwatch'
              ? 'bg-orange-600 text-black border border-orange-600'
              : 'text-white/60 border border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
          }`}
        >
          <Timer className="w-4 h-4 shrink-0" />
          <span>Stopwatch</span>
        </button>

        <button
          onClick={() => onChangeView('timer')}
          className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-semibold rounded-full transition-all cursor-pointer ${
            currentView === 'timer'
              ? 'bg-orange-600 text-black border border-orange-600'
              : 'text-white/60 border border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
          }`}
        >
          <Hourglass className="w-4 h-4 shrink-0" />
          <span>Timer</span>
        </button>

        <button
          onClick={() => onChangeView('laps')}
          className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-semibold rounded-full transition-all cursor-pointer ${
            currentView === 'laps'
              ? 'bg-orange-600 text-black border border-orange-600'
              : 'text-white/60 border border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
          }`}
        >
          <ClipboardList className="w-4 h-4 shrink-0" />
          <span>Laps</span>
        </button>
      </nav>

      {/* Upgrade Callout */}
      <div className="mt-auto pt-4 border-t border-white/5">
        {proUnlocked ? (
          <div className="bg-[#1A1A1A] border border-orange-600/20 rounded-2xl p-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="font-sans text-[10px] font-bold text-white/80 uppercase tracking-wider">
              Premium License Active
            </span>
          </div>
        ) : (
          <button
            onClick={onOpenUpgrade}
            className="w-full bg-[#1A1A1A] text-white hover:text-orange-500 hover:border-orange-500 font-sans text-xs font-bold py-3 px-4 rounded-xl border border-white/10 transition-all cursor-pointer uppercase tracking-widest"
          >
            Upgrade to Pro
          </button>
        )}
      </div>
    </aside>
  );
}
